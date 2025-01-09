using System.Management;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.User;
using BlogApi.Application.Helper;
using BlogApi.Core.Entities;
using BlogApi.Infrastructure.Persistence;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Services;

public class GoogleAuthService(HttpClient httpClient, BlogContext context, BaseSettings baseSettings)
{
    private readonly HttpClient _httpClient = httpClient;

    public async Task<ApiResult<MeDto>> ValidateGoogleTokenAsync(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [baseSettings.GoogleClientId],
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            var user = await context.Users.FirstOrDefaultAsync(x => x.Email == payload.Email);

            if (user == null)
            {
                user = new User
                {
                    Email = payload.Email,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    ExternalId = payload.Subject,
                    ExternalProvider = ExternalProviderEnum.Google,
                };
                context.Users.Add(user);
                await context.SaveChangesAsync();
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
} 