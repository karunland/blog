using BlogApi.Core.Enums;

namespace BlogApi.Application.DTOs.Blog;

public record BlogsDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string Slug { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthorName { get; set; }
    public string CategoryName { get; set; }
    public int CategoryId { get; set; }
    public int ViewCount { get; set; }
    public BlogStatusEnum StatusEnumId { get; set; }
    public string Status { get; set; }
    public string ImageUrl { get; set; }
    public int CommentCount { get; set; }
}