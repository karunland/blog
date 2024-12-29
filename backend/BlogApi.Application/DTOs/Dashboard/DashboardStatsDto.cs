using BlogApi.Application.DTOs.Blog;

public class DashboardStatsDto
{
    public int TotalBlogs { get; set; }
    public int TotalViews { get; set; }
    public int TotalComments { get; set; }
    public int TotalLikes { get; set; }
    public List<RecentActivityDto> RecentActivities { get; set; } = [];
    public List<PopularBlogDto> PopularBlogs { get; set; } = [];
    public List<CategoryStatsDto> CategoryStats { get; set; } = [];
    public List<BlogsDto> RecentBlogs { get; set; } = [];
    
}

public class RecentActivityDto
{
    public string Type { get; set; } // "comment", "like", "blog"
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PopularBlogDto
{
    public string Title { get; set; }
    public string Slug { get; set; }
    public int Views { get; set; }
    public int Comments { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CategoryStatsDto
{
    public string CategoryName { get; set; }
    public int BlogCount { get; set; }
} 