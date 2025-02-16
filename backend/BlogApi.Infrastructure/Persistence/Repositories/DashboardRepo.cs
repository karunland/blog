using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Application.DTOs.Dashboard;
using BlogApi.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class DashboardRepo(BlogContext context, ICurrentUserService currentUserService)
{
    public async Task<ApiResult<StatsResponse>> GetUserStats()
    {
        var userId = currentUserService.Id;
        
        var totalBlogs = await context.Blogs
                .Where(x => x.UserId == userId && x.BlogStatusEnum == Core.Enums.BlogStatusEnum.Published && !x.IsDeleted)
                .CountAsync();

        var totalViews = await context.Blogs
                .Where(x => x.UserId == userId && x.BlogStatusEnum == Core.Enums.BlogStatusEnum.Published && !x.IsDeleted)
                .SumAsync(x => x.ViewCount);

        var totalComments = await context.Comments
                .Where(x => x.UserId == userId && !x.IsDeleted)
                .CountAsync();

        var totalLikes = await context.Likes
                .Where(x => x.UserId == userId && !x.IsDeleted)
                .CountAsync();

        // your popular blogs
        var popularBlogs = await context.Blogs
                .Where(x => x.UserId == userId && x.BlogStatusEnum == Core.Enums.BlogStatusEnum.Published && !x.IsDeleted)
                .OrderByDescending(x => x.ViewCount)
                .Take(5)
                .Select(x => new BlogStatsResponse
                (
                    x.Title,
                    x.Slug,
                    x.CreatedAt,
                    x.ViewCount,
                    x.Category.Name,
                    x.User.FullName,
                    x.Content
                ))
                .ToListAsync();

        var recentBlogs = await context.Blogs
                .Where(x => x.UserId == userId && x.BlogStatusEnum == Core.Enums.BlogStatusEnum.Published && !x.IsDeleted)
                .OrderByDescending(x => x.CreatedAt)
                .Take(5)
                .Select(x => new BlogStatsResponse
                (
                    x.Title,
                    x.Slug,
                    x.CreatedAt,
                    x.ViewCount,
                    x.Category.Name,
                    x.User.FullName,
                    x.Content
                ))
                .ToListAsync();

        var categoryStats = await context.Categories
                .Where(x => !x.IsDeleted)
                .Select(x => new CategoryStatsResponse
                (
                    x.Name,
                    x.Blogs.Count(b => b.BlogStatusEnum == Core.Enums.BlogStatusEnum.Published && !b.IsDeleted)
                ))
                .ToListAsync();

        var stats = new StatsResponse
        (
            totalBlogs,
            totalViews,
            totalComments,
            totalLikes,
            categoryStats,
            recentBlogs,
            popularBlogs
        );

        return stats;
    }
}
