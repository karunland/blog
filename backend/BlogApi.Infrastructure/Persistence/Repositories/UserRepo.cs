using System.Net;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.File;
using BlogApi.Application.DTOs.User;
using BlogApi.Application.Helper;
using BlogApi.Application.Interfaces;
using BlogApi.Application.Services;
using BlogApi.Core.Entities;
using BlogApi.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Messages = BlogApi.Application.Common.Messages.Messages;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class UserRepo(BlogContext context, ICurrentUserService currentUserService, FileRepo fileRepo)
{
    public async Task<ApiResult> Register(UserAddDto user)
    {
        if (await context.Users.AnyAsync(x => x.Email == user.Email))
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
        };
        
        if (user.Image != null)
        {
            var response =  await fileRepo.UploadFileAsync(new UploadFileAsyncDto
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

        return ApiResult.Success();
    }
    
    public async Task<ApiResult<MeDto>> Login(UserLoginDto input)
    {
        var user = await context.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Email == input.Email && x.Password == input.Password.ToSha1());
        
        if (user == null)
        {
            return ApiError.Failure(Messages.NotFound, HttpStatusCode.NotFound);
        }
        
        return new MeDto
        {
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.Username,
            Token = TokenHelper.GenerateToken(new JwtTokenDto()
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Id = user.Id
            })
        };
    }
    
    public async Task<ApiResult<UserDto>> Me()
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserService.Id);
        
        if (user == null)
        {
            return ApiError.Failure(Messages.NotFound);
        }
        
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.Username
        };
    }
    
    public async Task<ApiResult> Update(UserAddDto user)
    {
        var currentUser = await context.Users.FindAsync(currentUserService.Id);
        
        if (currentUser == null)
            return ApiError.Failure(Messages.NotFound);
        
        currentUser.FirstName = user.FirstName;
        currentUser.LastName = user.LastName;
        currentUser.Username = user.UserName;
        currentUser.UpdatedAt = DateTime.UtcNow;
        
        if (user.Image != null)
        {
            var response =  await fileRepo.UploadFileAsync(new UploadFileAsyncDto
            {
                File = user.Image,
                Type = FileTypeEnum.ProfilePicture
            });

            currentUser.FileUrl = response.FileUrl;
            currentUser.FileName = response.FileName;
            currentUser.Extension = response.Extension;
        }
        
        await context.SaveChangesAsync();
        
        return ApiResult.Success();
    }
}