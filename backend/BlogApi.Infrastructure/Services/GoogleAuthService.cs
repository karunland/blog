using System.Net;
using BlogApi.Application.Common.Messages;
using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.User;
using BlogApi.Application.Helper;
using BlogApi.Core.Entities;
using BlogApi.Core.Interfaces;
using BlogApi.Infrastructure.Persistence;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Services;

public class GoogleAuthService(HttpClient httpClient, BlogContext context, BaseSettings baseSettings, IEmailService emailService)
{

    public async Task<ApiResult<MeDto>> GoogleLogin(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [baseSettings.GoogleClientId],
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            var user = await context.Users.FirstOrDefaultAsync(x => x.Email == payload.Email && x.IsGoogleRegister == true);

            if (user == null)
            {
                return ApiError.Failure("Google ile giriş yapmak için önce Google hesabınızı kayıt ediniz.", HttpStatusCode.NotFound);
            }

            return new MeDto
            {
                Email = payload.Email,
                FirstName = payload.GivenName,
                LastName = payload.FamilyName,
                Token = TokenHelper.GenerateToken(new JwtTokenDto()
                {
                    Email = payload.Email,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    Id = user.Id,
                }),
                ImageUrl = payload.Picture,
                ExternalId = payload.Subject,
                ExternalProvider = ExternalProviderEnum.Google,
            };
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to validate Google token: {ex.Message}");
        }
    }


    public async Task<ApiResult> GoogleRegisterAsync(string credential)
    {
        var result = await GoogleLogin(credential);
        if (!result.IsSuccess)
        {
            return ApiError.Failure(result.Message, HttpStatusCode.BadRequest);
        }

        if (await context.Users.AnyAsync(x => x.Email == result.Data.Email))
        {
            return ApiError.Failure(Messages.AlreadyExist, HttpStatusCode.BadRequest);
        }

        var newUser = new User
        {
            Email = result.Data.Email,
            FirstName = result.Data.FirstName,
            LastName = result.Data.LastName,
            ExternalId = result.Data.ExternalId,
            ExternalProvider = ExternalProviderEnum.Google,
            IsGoogleRegister = true,
            FileUrl = result.Data.ImageUrl
        };

        context.Users.Add(newUser);
        await context.SaveChangesAsync();

        var emailMessage = new EmailMessage
        {
            To = result.Data.Email,
            Subject = "Hesabınız Başarıyla Oluşturuldu",
            Body = "Hesabınız başarıyla oluşturuldu."
        };

        await emailService.SendEmailAsync(emailMessage);

        return ApiResult.Success();
    }
} 