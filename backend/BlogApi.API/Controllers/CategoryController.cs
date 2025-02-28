using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Category;
using BlogApi.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

public class CategoryController(CategoryRepo categoryRepo) : BaseApiController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResultPagination<CategoryListResponse>> List([FromQuery] FilterModel filter)
    {
        return await categoryRepo.GetAll(filter);
    }

    [HttpPost]
    public async Task<ApiResult> Create(CategoryAddDto category)
    {
        return await categoryRepo.Create(category);
    }

    [HttpDelete]
    public async Task<ApiResult> Delete([FromQuery] int id)
    {
        return await categoryRepo.Delete(id);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResult<List<CategoryListResponse>>> Categories()
    {
        return await categoryRepo.GetCategories();
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResult<List<CategoryListResponse>>> CategoriesAnyBlog()
    {
        return await categoryRepo.CategoriesAnyBlog();
    }
}