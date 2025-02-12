using BlogApi.Application.DTOs.Blog;

namespace BlogApi.Application.DTOs.Dashboard;

public record StatsResponse
(
    int TotalBlogs,
    int TotalViews,
    int TotalComments,
    int TotalLikes,
    List<CategoryStatsResponse> CategoryStats,
    List<BlogStatsResponse> RecentBlogs
);
