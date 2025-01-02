using BlogApi.Core.Enums;
using Microsoft.AspNetCore.Http;

namespace BlogApi.Application.DTOs.Blog;

public record BlogAddDto
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string Slug { get; set; }
    public string CategoryId { get; set; }
    public string Status { get; set; }
    public IFormFile Image { get; set; }
}