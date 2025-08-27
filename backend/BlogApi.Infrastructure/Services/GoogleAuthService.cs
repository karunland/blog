using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.User;
using BlogApi.Application.Helper;
using BlogApi.Core.Entities;
using BlogApi.Core.Interfaces;
using BlogApi.Infrastructure.Persistence;
using BlogApi.Utilities;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Services;

public class GoogleAuthService(BlogContext context, BaseSettings baseSettings, IEmailService emailService, TokenHelper tokenHelper)
{
    public async Task<ApiResult<MeResponse>> GoogleAuthAsync(string credential)
    {
        var isValidToken = await tokenHelper.VerifyGoogleAccessToken(credential);
        if (!isValidToken)
        {
            return ApiError.Failure();
        }

        var payload = await tokenHelper.GetUserInfoFromGoogle(credential);

        var result = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Email == payload.Email &&  x.ExternalProvider == ExternalProviderEnum.Google && !x.IsDeleted);

        if (result != null)
        {
            return new MeResponse(
                result!.Email,
                result.FirstName,
                result.LastName,
                tokenHelper.GenerateToken(new JwtTokenDto(
                    result.Id,
                    result.Email,
                    result.FirstName,
                    result.LastName,
                    result.FileUrl ?? ""
                )),
                baseSettings.BackendUrl + "/api/file/image/" + result.FileUrl,
                result.IsMailVerified,
                result.ExternalProvider,
                result.ExternalProvider.GetEnumDescription()
            );
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
            Subject = "Hesabın Başarıyla Oluşturuldu",
            Body = "Hesabın başarıyla oluşturuldu."
        };

        await emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);
        
        var returnDto = new MeResponse
        (
            newUser.Email,
            newUser.FirstName,
            newUser.LastName,
            tokenHelper.GenerateToken(new JwtTokenDto(newUser.Id, newUser.Email, newUser.FirstName, newUser.LastName, newUser.FileUrl)),
            baseSettings.BackendUrl + "/api/file/image/" + newUser.FileUrl,
            newUser.IsMailVerified,
            newUser.ExternalProvider,
            newUser.ExternalProvider.GetEnumDescription()
        );

        return returnDto;
    }
}
