using BlogApi.Core.Enums;
using Microsoft.AspNetCore.Http;

namespace BlogApi.Application.DTOs.Blog;

public record BlogUpdateRequest
(
    int Id,
    string Title,
    string Content,
    BlogStatusEnum Status,
    int CategoryId,
    IFormFile? Image
);