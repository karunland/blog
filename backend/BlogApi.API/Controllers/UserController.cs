using System.Net;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Application.DTOs.User;
using BlogApi.Infrastructure.Persistence.Repositories;
using BlogApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

public class UserController(UserRepo userRepo, BlogRepo blogRepo, GoogleAuthService googleAuthService) : BaseApiController
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
    public async Task<ApiResult> VerifyEmail([FromBody] string code)
    {
        return await userRepo.VerifyCode(code);
    }

    [HttpPost]
    [Authorize]
    public async Task<ApiResult> UpdateProfilePhoto(IFormFile image)
    {
        return await userRepo.UpdateProfilePhoto(image);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ApiResult> GoogleRegister(justString credential)
    {
        return await googleAuthService.GoogleRegisterAsync(credential.credential);
    }
    
    [HttpPost]
    public async Task<ApiResult> Update(UserAddDto user)
    {
        return await userRepo.Update(user);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ApiResult<MeDto>> Login(UserLoginDto user)
    {
        return await userRepo.Login(user);
    }
    
    [HttpPost]
    [AllowAnonymous]
    public async Task<ApiResult<MeDto>> GoogleLogin(justString credential)
    {
        try
        {
            return await googleAuthService.GoogleLogin(credential.credential);
        }
        catch (Exception ex)
        {
            return ApiError.Failure($"Google authentication failed: {ex.Message}", HttpStatusCode.InternalServerError);
        }
    }
    
    [HttpGet]
    public async Task<ApiResult<UserDto>> Me()
    {
        return await userRepo.Me();
    }
    
    [HttpGet]
    public async Task<ApiResultPagination<BlogsDto>> Blogs([FromQuery] FilterModel filter)
    {
        return await blogRepo.MyBlogs(filter);
    }
}

public class justString
{
    public string credential { get; set; }
}