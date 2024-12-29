namespace BlogApi.Application.DTOs;

public record FilterModel
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 9;
    public string? Search { get; set; }
}
