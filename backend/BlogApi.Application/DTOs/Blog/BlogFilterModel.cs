using BlogApi.Core.Enums;

namespace BlogApi.Application.DTOs.Blog;

public record BlogFilterModel
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 9;
    public string? Search { get; set; }
    public string? CategoryId { get; set; }
    public BlogSortTypesEnum SortType { get; set; } = BlogSortTypesEnum.EnYeniler;
}
