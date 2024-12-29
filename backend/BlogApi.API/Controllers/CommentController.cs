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
    public async Task<ApiResultPagination<CommentsDto>> List([FromQuery] string blogSlug, [FromQuery] FilterModel filter)
    {
        return await commentRepo.GetByBlogId(blogSlug, filter);
    }

    [HttpPost]
    public async Task<ApiResult> Create(CommentAddDto comment)
    {
        return await commentRepo.Create(comment);
    }
    
    [HttpPost]
    public async Task<ApiResult> Update(CommentAddDto comment)
    {
        return await commentRepo.Update(comment);
    }

    [HttpDelete]
    public async Task<ApiResult> Delete([FromRoute] int id)
    {
        return await commentRepo.Delete(id);
    }
}
