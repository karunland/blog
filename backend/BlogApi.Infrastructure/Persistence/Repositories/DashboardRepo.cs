using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class DashboardRepo(BlogContext context, ICurrentUserService currentUserService)
{
    public async Task<ApiResult<DashboardStatsDto>> GetUserStats()
    {
        var userId = currentUserService.Id;
        try
        {
            var stats = new DashboardStatsDto
            {
                TotalBlogs = await context.Blogs
                    .Where(x => x.UserId == userId && x.BlogStatusEnum == Core.Enums.BlogStatusEnum.Published && !x.IsDeleted)
                    .CountAsync(),
                    
                TotalComments = await context.Comments
                    .Where(x => x.UserId == userId && !x.IsDeleted)
                    .CountAsync(),
                    
                TotalViews = await context.Blogs
                    .Where(x => x.UserId == userId && x.BlogStatusEnum == Core.Enums.BlogStatusEnum.Published && !x.IsDeleted)
                    .SumAsync(x => x.ViewCount),
                    
                RecentBlogs = await context.Blogs
                    .Where(x => x.UserId == userId && x.BlogStatusEnum == Core.Enums.BlogStatusEnum.Published && !x.IsDeleted)
                    .OrderByDescending(x => x.CreatedAt)
                    .Take(5)
                    .Select(x => new BlogsDto
                    {
                        Title = x.Title,
                        Slug = x.Slug,
                        CreatedAt = x.CreatedAt,
                        ViewCount = x.ViewCount,
                        CategoryName = x.Category.Name,
                        AuthorName = x.User.FullName,
                        Content = x.Content,
                    })
                    .ToListAsync()
            };

            return stats;
        }
        catch (Exception ex)
        {
            return ApiError.Failure(ex.Message);
        }
    }
}
