
namespace BlogApi.Application.DTOs.Category;

public record CategoryListResponse(
    int Id,
    string Name,
    DateTime CreatedAt,
    int BlogsCount
);
