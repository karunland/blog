using BlogApi.Core.Enums;

namespace BlogApi.Application.DTOs.Blog;

public record BlogUpdateDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public BlogStatusEnum Status { get; set; }
    public int CategoryId { get; set; }
}