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
    public async Task<ApiResult<MeResponse>> GoogleLogin(string idToken)
    {
        var payload = await tokenHelper.VerifyGoogleAccessToken(idToken);
        if (!payload)
        {
            return ApiError.Failure();
        }
        
        var spayload = await tokenHelper.GetUserInfoFromGoogle(idToken);
        

        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == spayload.Email && x.IsGoogleRegister);

        if (user == null)
        {
            var newUser = new User
            {
                Email = spayload.Email,
                FirstName = spayload.GivenName,
                LastName = spayload.FamilyName,
                Username = spayload.Email.Split('@')[0],
                ExternalId = spayload.Id,
                ExternalProvider = ExternalProviderEnum.Google,
                IsGoogleRegister = true,
                FileUrl = spayload.Picture,
                IsMailVerified = true,
                FileName = spayload.Picture
            };

            context.Users.Add(newUser);
            await context.SaveChangesAsync();
        }

        return new MeResponse
        (
            user.Email,
            user.FirstName,
            user.LastName,
            TokenHelper.GenerateToken(new JwtTokenDto(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.FileUrl
            )),
            baseSettings.BackendUrl + "/api/file/image/" + user.FileUrl,
            user.IsMailVerified,
            user.ExternalProvider,
            user.ExternalProvider.GetEnumDescription()
        );
    }

    public async Task<ApiResult<MeResponse>> GoogleRegisterAsync(string credential)
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
            IsMailVerified = true,
            FileName = payload.Picture
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
        
        var returnDto = new MeResponse
        (
            newUser.Email,
            newUser.FirstName,
            newUser.LastName,
            TokenHelper.GenerateToken(new JwtTokenDto(newUser.Id, newUser.Email, newUser.FirstName, newUser.LastName, newUser.FileUrl)),
            baseSettings.BackendUrl + "/api/file/image/" + newUser.FileUrl,
            newUser.IsMailVerified,
            newUser.ExternalProvider,
            newUser.ExternalProvider.GetEnumDescription()
        );

        return returnDto;
    }
}
