using BlogApi.Application.DTOs.User;
using BlogApi.Application.Helper;
using BlogApi.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace BlogApi.Application.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public int Id => httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "LoggedInUser")?.Value.ToDeCryptoText().FromJson<JwtTokenDto>().Id ?? 0;
    public string LastName => httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "LoggedInUser")?.Value.ToDeCryptoText().FromJson<JwtTokenDto>().LastName ?? string.Empty;
    public string FirstName => httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "LoggedInUser")?.Value.ToDeCryptoText().FromJson<JwtTokenDto>().FirstName ?? string.Empty;
    public string Email => httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "LoggedInUser")?.Value.ToDeCryptoText().FromJson<JwtTokenDto>().Email ?? string.Empty;
}
