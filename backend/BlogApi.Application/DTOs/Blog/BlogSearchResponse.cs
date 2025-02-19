

namespace BlogApi.Application.DTOs.Blog;

public record BlogSearchResponse(
    int Id,
    string Title,
    string Slug,
    DateTime CreatedAt,
    string CategoryName
);