using System.Net;
using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Application.DTOs.File;
using BlogApi.Application.DTOs.User;
using BlogApi.Application.Helper;
using BlogApi.Application.Interfaces;
using BlogApi.Core.Entities;
using BlogApi.Core.Enums;
using BlogApi.Core.Interfaces;
using BlogApi.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Messages = BlogApi.Application.Common.Messages.Messages;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class UserRepo(BlogContext context, ICurrentUserService currentUserService, FileRepo fileRepo, IEmailService emailService, BaseSettings baseSettings)
{
    public async Task<ApiResult> Register(UserAddDto user)
    {
        if (await context.Users.AnyAsync(x => (x.Email == user.Email && x.IsGoogleRegister == false) || (x.ExternalId == user.Email && x.IsGoogleRegister == true)))
        {
            return ApiError.Failure(Messages.AlreadyExist, HttpStatusCode.BadRequest);
        }
        
        var newUser = new User
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.UserName,
            Email = user.Email,
            Password = user.Password.ToSha1(),
            IsMailVerified = false
        };

        if (user.Image != null)
        {
            var response = await fileRepo.UploadFileAsync(new UploadFileAsyncDto
            {
                File = user.Image,
                Type = FileTypeEnum.ProfilePicture
            });

            newUser.FileUrl = response.FileUrl;
            newUser.FileName = response.FileName;
            newUser.Extension = response.Extension;
        }

        context.Users.Add(newUser);
        await context.SaveChangesAsync();
        
        // Send welcome email
        var emailMessage = new EmailMessage
        {
            To = newUser.Email,
            Subject = "DevLog - Welcome",
            IsHtml = true,
            Body = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <h2>Hello {newUser.FirstName} {newUser.LastName}!</h2>
                    <p>Welcome to DevLog. We are glad to see you here.</p>
                </div>"
        };
        
        await emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);
        

        return ApiResult.Success();
    }

    public async Task<ApiResult> SendVerificationCode()
    {
        var user = await context.Users.FindAsync(currentUserService.Id);
        if (user == null)
            return ApiError.Failure(Messages.NotFound);

        if (user.IsMailVerified)
            return ApiError.Failure("Email already verified");

        var verificationCode = new VerificationCodes
        {
            Code = Guid.NewGuid().ToString().Substring(0, 6).ToUpper(),
            Email = user.Email,
            ExpirationDate = DateTime.UtcNow.AddMinutes(10),
            IsUsed = false,
            User = user
        };

        var emailMessage = new EmailMessage
        {
            To = user.Email,
            Subject = "DevLog - Email Verification Code",
            IsHtml = true,
            Body = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <h2>Hello {user.FirstName} {user.LastName}!</h2>
                    <p>Your email verification code is:</p>
                    <h1 style='text-align: center; color: #4CAF50; font-size: 32px; letter-spacing: 5px;'>{verificationCode.Code}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>"
        };

        context.VerificationCodes.Add(verificationCode);
        await context.SaveChangesAsync();
        await emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);

        return ApiResult.Success();
    }

    public async Task<ApiResult> VerifyCode(string code)
    {
        var user = await context.Users.FindAsync(currentUserService.Id);
        if (user == null)
            return ApiError.Failure(Messages.NotFound);

        var verificationCode = await context.VerificationCodes.OrderByDescending(x => x.Id)
            .FirstOrDefaultAsync(x => x.Code == code && x.Email == user.Email && !x.IsUsed && x.ExpirationDate > DateTime.UtcNow);
        
        if (verificationCode == null)
            return ApiError.Failure("Geçersiz veya süresi dolmuş doğrulama kodu");

        verificationCode.IsUsed = true;
        user.IsMailVerified = true;
        await context.SaveChangesAsync();

        var emailMessage = new EmailMessage
        {
            To = user.Email,
            Subject = "DevLog - Email Doğrulama Başarılı",
            IsHtml = true,
            Body = $"Email doğrulama işlemi başarıyla tamamlandı."
        };

        await emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);

        return ApiResult.Success();
    }

    public async Task<ApiResult> UpdateProfilePhoto(IFormFile image)
    {
        var user = await context.Users.FindAsync(currentUserService.Id);
        if (user == null)
            return ApiError.Failure(Messages.NotFound);

        var response = await fileRepo.UploadFileAsync(new UploadFileAsyncDto
        {
            File = image,
            Type = FileTypeEnum.ProfilePicture
        });

        user.FileUrl = response.FileUrl;
        user.FileName = response.FileName;
        user.Extension = response.Extension;
        user.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        return ApiResult.Success();
    }

    public async Task<ApiResult> Update(UserUpdateRequest user)
    {
        var currentUser = await context.Users.FindAsync(currentUserService.Id);
        if (currentUser == null)
            return ApiError.Failure(Messages.NotFound);

        if (currentUser.IsMailVerified && currentUser.Email != user.Email)
            return ApiError.Failure("Onaylanmış e-posta adresi değiştirilemez.");

        currentUser.FirstName = user.FirstName;
        currentUser.LastName = user.LastName;
        currentUser.Username = user.UserName;
        currentUser.Email = user.Email;
        currentUser.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        return ApiResult.Success();
    }

    public async Task<ApiResult<MeResponse>> Login(UserLoginDto input)
    {
        var user = await context.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Email == input.Email && x.Password == input.Password.ToSha1());
        
        if (user == null) return ApiError.Failure(Messages.NotFound);
        
        return new MeResponse
        (
            user.Email,
            user.FirstName,
            user.LastName,
            TokenHelper.GenerateToken(new JwtTokenDto(
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                baseSettings.BackendUrl + "/api/file/image/" + user.FileUrl
            )),
            baseSettings.BackendUrl + "/api/file/image/" + user.FileUrl,
            user.IsMailVerified,
            user.ExternalProvider,
            user.ExternalProvider.GetEnumDescription()
        );
    }
    
    public async Task<ApiResult<UserDto>> Me()
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserService.Id);
        
        if (user == null) return ApiError.Failure(Messages.NotFound);
        
        return new UserDto
        (
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Username,
            baseSettings.BackendUrl + "/api/file/image/" + user.FileUrl,
            user.IsMailVerified,
            user.ExternalProvider,
            user.ExternalProvider.GetEnumDescription()
        );
    }

    public async Task<ApiResult<MeResponse>> ExternalLogin(ExternalAuthRequest externalUser)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == externalUser.Email);

        if (user == null)
        {
            user = new User
            {
                Email = externalUser.Email,
                FirstName = externalUser.FirstName,
                LastName = externalUser.LastName,
                Username = externalUser.Email.Split('@')[0],
                ExternalId = externalUser.ExternalId,
                ExternalProvider = ExternalProviderEnum.Google,
                ExternalPictureUrl = externalUser.ExternalPictureUrl,
                IsExternalAuth = true
            };

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
        }
        else
        {
            if (!user.IsExternalAuth || user.ExternalId != externalUser.ExternalId)
            {
                user.ExternalId = externalUser.ExternalId;
                user.ExternalProvider = ExternalProviderEnum.Google;
                user.ExternalPictureUrl = externalUser.ExternalPictureUrl;
                user.IsExternalAuth = true;
                await context.SaveChangesAsync();
            }
        }

        var token = TokenHelper.GenerateToken(new JwtTokenDto(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            baseSettings.BackendUrl + "/api/file/image/" + user.FileUrl
        ));

        var meDto = new MeResponse
        (
            user.Email,
            user.FirstName,
            user.LastName,
            token,
            baseSettings.BackendUrl + "/api/file/image/" + user.FileUrl,
            user.IsMailVerified,
            user.ExternalProvider,
            user.ExternalProvider.GetEnumDescription()
        );

        return meDto;
    }

    public async Task<ApiResultPagination<BlogListResponse>> Blogs(FilterModel filter)
    {
        var blogs = context.Blogs
            .OrderByDescending(x => x.UpdatedAt)
            .ThenByDescending(x => x.CreatedAt)
            .AsNoTracking()
            .Where(x => x.UserId == currentUserService.Id)
            .Select(x => new BlogListResponse
            (
                x.Id,
                x.Title,
                x.Content,
                x.Slug,
                x.CreatedAt,
                x.User.FullName,
                x.User.ExternalProvider == ExternalProviderEnum.Google && x.User.FileUrl != null && x.User.FileUrl.StartsWith("http") ? x.User.FileUrl : baseSettings.BackendUrl + "/api/file/image/" + x.User.FileUrl,
                x.Category.Name,
                x.CategoryId,
                x.ViewCount,
                x.BlogStatusEnum,
                x.BlogStatusEnum.ToString(),
                x.ImageUrl,
                x.Comments.Count,
                x.Likes.Count,
                x.Likes.Any(l => l.UserId == currentUserService.Id && !l.IsDeleted)
            ));

        return await blogs.PaginatedListAsync(filter.PageNumber, filter.PageSize);
    }
}