using BlogApi.Application.Common.Messages;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Comment;
using BlogApi.Application.Interfaces;
using BlogApi.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class CommentRepo(BlogContext context, ICurrentUserService currentUserService)
{
    public async Task<ApiResult> Create(CommentAddDto input)
    {
        var newComment = new Comment
        {
            BlogId = input.BlogId,
            Content = input.Content,
            UserId = currentUserService.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt  = null
        };

        context.Comments.Add(newComment);
        await context.SaveChangesAsync();

        return ApiResult.Success();
    }
    
    public async Task<ApiResultPagination<CommentsDto>> GetByBlogId(string slug, FilterModel filter)
    {
        var comments = context.Comments
            .Where(x => x.Blog.Slug == slug)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new CommentsDto
            {
                Id = x.Id,
                Content = x.Content,
                CreatedAt = x.CreatedAt,
                AuthorName = x.User.FullName,
                UpdatedAt = x.UpdatedAt
            });

        return await comments.PaginatedListAsync(filter.PageNumber, filter.PageSize);
    }
    
    public async Task<ApiResult> Update(CommentAddDto input)
    {
        var commentToUpdate = await context.Comments.SingleOrDefaultAsync(x => x.Id == input.Id && x.UserId == currentUserService.Id);

        if (commentToUpdate == null)
            return ApiError.Failure(Messages.NotFound);

        commentToUpdate.Content = input.Content;
        commentToUpdate.UpdatedAt = DateTime.UtcNow;
        
        await context.SaveChangesAsync();

        return ApiResult.Success();
    }
    
    public async Task<ApiResult> Delete(int id)
    {
        var comment = await context.Comments.SingleOrDefaultAsync(x => x.UserId == currentUserService.Id && x.Id == id);
        if (comment == null)
        {
            return ApiError.Failure(Messages.NotFound);
        }

        context.Comments.Remove(comment);
        await context.SaveChangesAsync();

        return ApiResult.Success();
    }
}