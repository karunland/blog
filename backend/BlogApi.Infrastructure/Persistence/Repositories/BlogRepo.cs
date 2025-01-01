using BlogApi.Application.Common.Messages;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Application.Interfaces;
using BlogApi.Core.Entities;
using BlogApi.Core.Enums;
using BlogApi.Utilities;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class BlogRepo(BlogContext context, ICurrentUserService currentUserService)
{
    public async Task<ApiResultPagination<BlogsDto>> GetAll(BlogFilterModel filter)
    {
        var blogs = context.Blogs
            .OrderByDescending(x => x.Id);
        
        if (!string.IsNullOrEmpty(filter.Search)) 
            blogs = (IOrderedQueryable<Blog>)blogs.Where(x => x.Title.Contains(filter.Search));

        if (!string.IsNullOrEmpty(filter.CategoryId))
            blogs = (IOrderedQueryable<Blog>)blogs.Where(x => x.CategoryId == int.Parse(filter.CategoryId));

        if (filter.SortType == BlogSortTypesEnum.EnEskiler)
            blogs = blogs.OrderBy(x => x.CreatedAt);
        else
            blogs = blogs.OrderByDescending(x => x.CreatedAt);

        var result = blogs.Select(x => new BlogsDto
        {
            Id = x.Id,
            Title = x.Title,
            Content = x.Content.Length > 100 ? x.Content.Substring(0, 100) + "..." : x.Content,
            CreatedAt = x.CreatedAt,
            AuthorName = x.User.FullName,
            Slug = x.Slug,
            CategoryName = x.Category.Name,
            ViewCount = x.ViewCount
        });

        return await result.PaginatedListAsync(filter.PageNumber, filter.PageSize);
    }

    public async Task<ApiResult> Create(BlogAddDto blog)
    {
        var newBlog = new Blog
        {
            Title = blog.Title,
            Content = blog.Content,
            UserId = currentUserService.Id,
            BlogStatusEnum = (BlogStatusEnum)int.Parse(blog.Status),
            CategoryId = int.Parse(blog.CategoryId),
            Slug = blog.Slug,
            CreatedAt = DateTime.UtcNow
        };

        context.Blogs.Add(newBlog);
        await context.SaveChangesAsync();

        return ApiResult.Success();
    }

    public async Task<ApiResultPagination<BlogsDto>> MyBlogs(FilterModel filter)
    {
        var blogs = context.Blogs
            .Where(x => x.UserId == currentUserService.Id)
            .OrderByDescending(x => x.UpdatedAt)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => new BlogsDto
            {
                Id = x.Id,
                Title = x.Title,
                Content = x.Content,
                CreatedAt = x.CreatedAt,
                AuthorName = x.User.FullName,
                Slug = x.Slug,
                CategoryName = x.Category.Name,
                CategoryId = x.CategoryId,
                ViewCount = x.ViewCount,
                StatusEnumId = x.BlogStatusEnum,
                Status = x.BlogStatusEnum.GetEnumDescription()
            });

        return await blogs.PaginatedListAsync(filter.PageNumber, filter.PageSize);
    }

    public async Task<ApiResult> Update(BlogUpdateDto blog)
    {
        var blogToUpdate = await context.Blogs
            .FirstOrDefaultAsync(x => x.Id == blog.Id && x.UserId == currentUserService.Id);

        if (blogToUpdate == null) return ApiError.Failure("Blog bulunamadı veya düzenleme yetkiniz yok.");

        blogToUpdate.Title = blog.Title;
        blogToUpdate.Content = blog.Content;
        blogToUpdate.CategoryId = blog.CategoryId;
        blogToUpdate.BlogStatusEnum = blog.Status;
        blogToUpdate.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return ApiResult.Success();
    }

    public async Task<ApiResult> Delete(string slug)
    {
        var blogToDelete = await context.Blogs.FirstOrDefaultAsync(x => x.Slug == slug && x.UserId == currentUserService.Id);

        if (blogToDelete == null) return ApiError.Failure();

        blogToDelete.IsDeleted = true;
        blogToDelete.DeletedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return ApiResult.Success();
    }

    public async Task<ApiResult<BlogsDto>> Detail(string slug)
    {
        var blog = await context.Blogs
            .Where(x => x.Slug == slug)
            .Select(x => new BlogsDto
            {
                Id = x.Id,
                Title = x.Title,
                Content = x.Content,
                CreatedAt = x.CreatedAt,
                AuthorName = x.User.FullName,
                Slug = x.Slug,
                CategoryName = x.Category.Name,
                CategoryId = x.CategoryId,
                ViewCount = x.ViewCount,
                StatusEnumId = x.BlogStatusEnum,
            })
            .FirstOrDefaultAsync();

        if (blog == null)
            return ApiError.Failure();

        return blog;
    }

    public async Task<ApiResult<List<BlogsDto>>> Search(string search)
    {
        var blogs = context.Blogs
            .Where(x => x.Title.Contains(search) || x.Content.Contains(search) || x.Slug.Contains(search))
            .OrderByDescending(x => x.CreatedAt);

        return await blogs.Select(x => new BlogsDto
        {
            CreatedAt = x.CreatedAt,
            Title = x.Title,
            Slug = x.Slug,
            CategoryName = x.Category.Name,
            AuthorName = x.User.FullName,
        }).ToListAsync();
    }
}