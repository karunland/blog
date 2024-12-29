using BlogApi.Application.DTOs.File;
using BlogApi.Application.Services;
using BlogApi.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

public class FileController(FileRepo fileRepo) : BaseApiController
{
    [HttpPost("UploadFile")]
    public async Task<IActionResult> UploadFile([FromForm] UploadFileAsyncDto model)
    {
        try
        {
            var fileResponse = await fileRepo.UploadFileAsync(model);
            return Ok(fileResponse);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("Image/{imageUrl}")]
    public async Task<IActionResult> Image([FromRoute] string imageUrl)
    {
        var file = await fileRepo.GetFileAsync(imageUrl);
        Response.Headers.Append("Content-Disposition", "inline; filename=" + file.FileName);

        return File(file.FileContents, file.ContentType);
    }
}