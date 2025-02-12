using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Comment;
using BlogApi.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

public class CommentController(CommentRepo commentRepo) : BaseApiController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ApiResultPagination<CommentListResponse>> List([FromQuery] string blogSlug, [FromQuery] FilterModel filter)
    {
        return await commentRepo.GetByBlogId(blogSlug, filter);
    }

    [HttpPost]
    public async Task<ApiResult> Create(CommentAddRequest comment)
    {
        return await commentRepo.Create(comment);
    }
    
    [HttpPost]
    public async Task<ApiResult> Update(CommentAddRequest comment)
    {
        return await commentRepo.Update(comment);
    }

    [HttpDelete]
    public async Task<ApiResult> Delete(int id)
    {
        return await commentRepo.Delete(id);
    }
}
