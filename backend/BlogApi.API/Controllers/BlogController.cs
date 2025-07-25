﻿using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

public class BlogController(BlogRepo blogRepo) : BaseApiController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResultPagination<ListResponse>> List([FromQuery] BlogFilterModel filter)
    {
        return await blogRepo.GetAll(filter);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResult<DetailResponse>> Detail([FromQuery] string slug)
    {
        return await blogRepo.Detail(slug);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResultPagination<ListResponse>> GetAll([FromQuery] BlogFilterModel filter)
    {
        return await blogRepo.GetAll(filter);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResultPagination<ListResponse>> GetBlogersBlogs([FromQuery] BlogFilterModel filter, [FromQuery] string userMail)
    {
        return await blogRepo.GetBlogersBlogs(filter, userMail);
    }

    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ApiResult> Create([FromForm] BlogAddRequest blog)
    {
        return await blogRepo.Create(blog);
    }

    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ApiResult> Update([FromForm] BlogUpdateRequest blog)
    {
        return await blogRepo.Update(blog);
    }

    [HttpPost]
    public async Task<ApiResult> Delete(string slug)
    {
        return await blogRepo.Delete(slug);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResult<List<SearchResponse>>> Search([FromQuery] string search)
    {
        return await blogRepo.Search(search);
    }

    [HttpPost]
    public async Task<ApiResult> ChangeStatus(ChangeStatusRequest request)
    {
        return await blogRepo.ChangeStatus(request);
    }

    [HttpPost]
    public async Task<ApiResult<LikeResponse>> Like(LikeRequest request)
    {
        return await blogRepo.ToggleLikeBlog(request);
    }
}
