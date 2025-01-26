using System.Net;
using BlogApi.Application.Common.Messages;
using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.User;
using BlogApi.Application.Helper;
using BlogApi.Core.Entities;
using BlogApi.Core.Interfaces;
using BlogApi.Infrastructure.Persistence;
using BlogApi.Utilities;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Services;

public class GoogleAuthService(BlogContext context, BaseSettings baseSettings, IEmailService emailService, TokenHelper tokenHelper)
{
    public async Task<ApiResult<MeDto>> GoogleLogin(string idToken)
    {
        var payload = await tokenHelper.VerifyGoogleAccessToken(idToken);
        if (!payload)
        {
            return ApiError.Failure();
        }
        
        var spayload = await tokenHelper.GetUserInfoFromGoogle(idToken);
        

        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == spayload.Email && x.IsGoogleRegister);

        if (user == null)
            return ApiError.Failure("Google ile giriş yapmak için önce Google hesabınızı kayıt ediniz.");

        return new MeDto
        {
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Token = TokenHelper.GenerateToken(new JwtTokenDto()
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Id = user.Id,
            }),
            ImageUrl = user.FileUrl,
            ExternalProvider = user.ExternalId,
            ExternalProviderId = ExternalProviderEnum.Google,
        };
    }

    public async Task<ApiResult<MeDto>> GoogleRegisterAsync(string credential)
    {
        var isValidToken = await tokenHelper.VerifyGoogleAccessToken(credential);
        if (!isValidToken)
        {
            return ApiError.Failure();
        }

        var payload = await tokenHelper.GetUserInfoFromGoogle(credential);
        if (payload == null)
        {
            return ApiError.Failure();
        }

        var result = await context.Users.FirstOrDefaultAsync(x => x.Email == payload.Email &&  x.ExternalProvider == ExternalProviderEnum.Google);

        if (result != null)
        {
            return ApiError.Failure(Messages.AlreadyExist);
        }

        var newUser = new User
        {
            Email = payload.Email,
            FirstName = payload.GivenName,
            LastName = payload.FamilyName,
            Username = payload.Email.Split('@')[0],
            ExternalId = payload.Id,
            ExternalProvider = ExternalProviderEnum.Google,
            IsGoogleRegister = true,
            FileUrl = payload.Picture,
            IsMailVerified = true
        };

        context.Users.Add(newUser);
        await context.SaveChangesAsync();

        var emailMessage = new EmailMessage
        {
            To = payload.Email,
            Subject = "Hesabınız Başarıyla Oluşturuldu",
            Body = "Hesabınız başarıyla oluşturuldu."
        };

        await emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);

        return new MeDto
        {
            Email = newUser.Email,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            Token = TokenHelper.GenerateToken(new JwtTokenDto()
            {
                Email = newUser.Email,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Id = newUser.Id,
            }),
            ImageUrl = newUser.FileUrl,
            ExternalProvider = newUser.ExternalProvider.GetEnumDescription(),
            ExternalProviderId = newUser.ExternalProvider,
        };
    }
}
