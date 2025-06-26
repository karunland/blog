using Microsoft.AspNetCore.Http;

namespace BlogApi.Application.DTOs.Blog;

public record BlogAddRequest(
    string Title,
    string Content,
    string CategoryId,
    string Status,
    IFormFile? Image
);