using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using BlogApi.Application.DTOs.User;

namespace BlogApi.Infrastructure.Services;

public class GoogleAuthService(IConfiguration configuration)
{
    private readonly string _clientId = configuration["Authentication:Google:ClientId"];

    public async Task<ExternalAuthDto> ValidateGoogleTokenAsync(string credential)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = [_clientId]
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(credential, settings);

        return new ExternalAuthDto
        {
            Email = payload.Email,
            FirstName = payload.GivenName,
            LastName = payload.FamilyName,
            ExternalId = payload.Subject,
            ExternalProvider = "Google",
            ExternalPictureUrl = payload.Picture
        };
    }
} 