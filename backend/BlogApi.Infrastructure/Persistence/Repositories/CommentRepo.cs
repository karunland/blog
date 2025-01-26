using BlogApi.Application.Common.Messages;
using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Comment;
using BlogApi.Application.Interfaces;
using BlogApi.Core.Entities;
using BlogApi.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class CommentRepo(BlogContext _context, ICurrentUserService _currentUserService, IEmailService _emailService, BaseSettings baseSettings)
{


    public async Task<ApiResult> Create(CommentAddDto input)
    {
        var blog = await _context.Blogs
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Slug == input.BlogSlug);

        if (blog == null)
            return ApiError.Failure(Messages.NotFound);

        var commenter = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == _currentUserService.Id);

        var newComment = new Comment
        {
            BlogId = blog.Id == null ? 0 : blog.Id,
            Content = input.Content,
            UserId = _currentUserService.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null
        };

        _context.Comments.Add(newComment);
        await _context.SaveChangesAsync();

        // Send email notification to blog owner
        var emailSubject = "Yeni Yorum Bildirimi";
        var emailBody = $@"
            <h3>Blog yazınıza yeni bir yorum yapıldı</h3>
            <p><strong>Blog Başlığı:</strong> {blog.Title}</p>
            <p><strong>Yorum Yapan:</strong> {commenter.FullName}</p>
            <p><strong>Yorum:</strong> {input.Content}</p>
            <p><strong>Tarih:</strong> {newComment.CreatedAt:dd.MM.yyyy HH:mm}</p>
        ";

        await _emailService.SendEmailAsync(blog.User.Email, emailSubject, emailBody, true);

        return ApiResult.Success();
    }
    
    public async Task<ApiResultPagination<CommentsDto>> GetByBlogId(string slug, FilterModel filter)
    {
        var comments = _context.Comments
            .Where(x => x.Blog.Slug == slug)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new CommentsDto
            {
                Id = x.Id,
                Content = x.Content,
                CreatedAt = x.CreatedAt,
                AuthorName = x.User.FullName,
                UpdatedAt = x.UpdatedAt,
                IsMyComment = x.UserId == _currentUserService.Id,
                AuthorImageUrl = baseSettings.BackendUrl + "/api/file/image/" + x.User.FileUrl
            });

        return await comments.PaginatedListAsync(filter.PageNumber, filter.PageSize);
    }
    
    public async Task<ApiResult> Update(CommentAddDto input)
    {
        var commentToUpdate = await _context.Comments.SingleOrDefaultAsync(x => x.Id == input.Id && x.UserId == _currentUserService.Id);

        if (commentToUpdate == null)
            return ApiError.Failure(Messages.NotFound);

        commentToUpdate.Content = input.Content;
        commentToUpdate.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();

        return ApiResult.Success();
    }
    
    public async Task<ApiResult> Delete(int id)
    {
        var comment = await _context.Comments
            .FirstOrDefaultAsync(x => x.UserId == _currentUserService.Id && x.Id == id);
        
        if (comment == null)
            return ApiError.Failure(Messages.NotFound);

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return ApiResult.Success();
    }
}