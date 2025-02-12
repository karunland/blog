
namespace BlogApi.Application.DTOs.Dashboard;

public record PopularBlogResponse
(
    string Title,
    string Slug,
    int Views,
    int Comments,
    DateTime CreatedAt
);
