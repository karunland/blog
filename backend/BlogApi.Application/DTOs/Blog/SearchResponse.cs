
namespace BlogApi.Application.DTOs.Blog;

public record SearchResponse
(
    string Slug,
    string Title,
    string CategoryName
);