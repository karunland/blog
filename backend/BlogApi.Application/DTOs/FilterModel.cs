
namespace BlogApi.Application.DTOs;

public record FilterModel
(
    int PageNumber = 1,
    int PageSize = 9,
    string? Search = null
);
