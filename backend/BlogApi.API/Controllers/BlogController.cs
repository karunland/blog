using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

public class BlogController(BlogRepo blogRepo) : BaseApiController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResultPagination<BlogsDto>> List([FromQuery] BlogFilterModel filter)
    {
        return await blogRepo.GetAll(filter);
    }
    
    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResult<BlogsDto>> Detail([FromQuery] string slug)
    {
        return await blogRepo.Detail(slug);
    }
    
    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResultPagination<BlogsDto>> GetAll([FromQuery] BlogFilterModel filter)
    {
        return await blogRepo.GetAll(filter);
    }
    
    [HttpPost]
    public async Task<ApiResult> Create(BlogAddDto blog)
    {
        return await blogRepo.Create(blog);
    }
    
    [HttpPost]
    public async Task<ApiResult> Update(BlogUpdateDto blog)
    {
        return await blogRepo.Update(blog);
    }
    
    [HttpDelete]
    public async Task<ApiResult> Delete([FromRoute] string slug)
    {
        return await blogRepo.Delete(slug);
    }
    
}