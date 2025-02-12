
namespace BlogApi.Application.DTOs.Dashboard;

public record RecentActivityResponse
(
    string Type,
    string Content,
    DateTime CreatedAt
);
