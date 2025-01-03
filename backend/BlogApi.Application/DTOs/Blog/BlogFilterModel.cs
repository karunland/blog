using BlogApi.Core.Enums;

namespace BlogApi.Application.DTOs.Blog;

public class BlogFilterModel
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 9;
    public string? Search { get; set; }
    public string? CategoryId { get; set; }
    public BlogSortType SortBy { get; set; } = BlogSortType.Newest;
}