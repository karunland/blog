using BlogApi.Application.Common.Messages;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Category;
using BlogApi.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public partial class CategoryRepo(BlogContext context)
{
    public async Task<ApiResult> Create(CategoryAddDto category)
    {
        var newCategory = new Category
        {
            Name = category.Name,
            CreatedAt = DateTime.UtcNow
        };

        context.Categories.Add(newCategory);
        await context.SaveChangesAsync();

        return ApiResult.Success();
    }

    public async Task<ApiResultPagination<CategoryListResponse>> GetAll(FilterModel filter)
    {
        var categories = context.Categories
            .Select(x => new CategoryListResponse
            (
                x.Id,
                x.Name,
                x.CreatedAt,
                x.Blogs.Count
            ));

        return await categories.PaginatedListAsync(filter.PageNumber, filter.PageSize);
    }

    public async Task<ApiResult> Delete(int id)
    {
        var category = await context.Categories.FindAsync(id);
        if (category == null)
        {
            return ApiError.Failure(Messages.NotFound);
        }

        context.Categories.Remove(category);
        await context.SaveChangesAsync();

        return ApiResult.Success();
    }

    public async Task<ApiResult<List<CategoryListResponse>>> GetCategories()
    {
        var categories = await context.Categories
            .Select(x => new CategoryListResponse
            (
                x.Id,
                x.Name,
                x.CreatedAt,
                x.Blogs.Count
            ))
            .ToListAsync();

        return categories;
    }
}