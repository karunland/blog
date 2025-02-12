
namespace BlogApi.Application.DTOs.Blog;

public record ChangeStatusRequest(string slug, int status);
