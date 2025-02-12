
namespace BlogApi.Application.DTOs.Dashboard;

public record CategoryStatsResponse
(
    string CategoryName,
    int BlogCount
);
