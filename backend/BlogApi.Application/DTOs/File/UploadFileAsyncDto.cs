using BlogApi.Core.Enums;
using Microsoft.AspNetCore.Http;

namespace BlogApi.Application.DTOs.File;

public record UploadFileAsyncDto
{
    public required IFormFile File { get; set; }
    public FileTypeEnum Type { get; set; }
}