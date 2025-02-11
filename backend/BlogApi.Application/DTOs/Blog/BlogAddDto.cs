using BlogApi.Core.Enums;
using Microsoft.AspNetCore.Http;

namespace BlogApi.Application.DTOs.Blog;

public record BlogDto
{
    public int? Id { get; set; }  // Update işleminde kullanılacak
    public string Title { get; set; }
    public string Content { get; set; }
    public string CategoryId { get; set; }
    public string Status { get; set; }
    public IFormFile? Image { get; set; }
    public string? Slug { get; set; }  // Create işleminde otomatik oluşturulacak
}