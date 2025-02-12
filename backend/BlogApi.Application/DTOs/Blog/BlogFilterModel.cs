using BlogApi.Core.Enums;

namespace BlogApi.Application.DTOs.Blog;

public record BlogFilterModel
(
    int PageNumber = 1,
    int PageSize = 9,
    string? Search = null,
    string? CategoryId = null,
    BlogSortType SortBy = BlogSortType.Newest
);