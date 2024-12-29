using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Application.DTOs.User;
using BlogApi.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

public class UserController(UserRepo userRepo, BlogRepo blogRepo) : BaseApiController
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<ApiResult> Register(UserAddDto user)
    {
        var result = await userRepo.Register(user);
        return result;
    }
    
    // update
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