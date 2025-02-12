
namespace BlogApi.Application.DTOs.Blog;

public record BlogStatsResponse
(
    string Title,
    string Slug,
    DateTime CreatedAt,
    int ViewCount,
    string CategoryName,
    string AuthorName,
    string Content
);