using BlogApi.Core.Enums;
using Microsoft.AspNetCore.Http;

namespace BlogApi.Application.DTOs.Blog;

public record BlogUpdateDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public BlogStatusEnum Status { get; set; }
    public int CategoryId { get; set; }
    public IFormFile Image { get; set; }
}