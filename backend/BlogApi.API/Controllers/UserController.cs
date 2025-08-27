using System.Net;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Application.DTOs.User;
using BlogApi.Infrastructure.Persistence.Repositories;
using BlogApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

public class UserController(UserRepo userRepo, GoogleAuthService googleAuthService) : BaseApiController
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<ApiResult> Register(UserAddDto user)
    {
        var result = await userRepo.Register(user);
        return result;
    }

    [HttpPost]
    [Authorize]
    public async Task<ApiResult> SendVerificationCode()
    {
        return await userRepo.SendVerificationCode();
    }

    [HttpPost]
    [Authorize]
    public async Task<ApiResult> VerifyEmail(justString code)
    {
        return await userRepo.VerifyCode(code.credential);
    }

    [HttpPost]
    [Authorize]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ApiResult> UpdateProfilePhoto(IFormFile image)
    {
        return await userRepo.UpdateProfilePhoto(image);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ApiResult<MeResponse>> GoogleLogin(justString credential)
    {
        return await googleAuthService.GoogleAuthAsync(credential.credential);
    }

    [HttpPost]
    public async Task<ApiResult> Update(UserUpdateRequest user)
    {
        return await userRepo.Update(user);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ApiResult<MeResponse>> Login(UserLoginDto user)
    {
        return await userRepo.Login(user);
    }

    [HttpGet]
    public async Task<ApiResult<UserDto>> Me()
    {
        return await userRepo.Me();
    }

    [HttpGet]
    public async Task<ApiResultPagination<MyListResponse>> Blogs([FromQuery] FilterModel filter)
    {
        return await userRepo.Blogs(filter);
    }
}
