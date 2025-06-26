using BlogApi.Application.Common.Messages;
using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Comment;
using BlogApi.Application.Interfaces;
using BlogApi.Core.Entities;
using BlogApi.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class CommentRepo(
    BlogContext _context,
    ICurrentUserService _currentUserService,
    IEmailService _emailService,
    BaseSettings baseSettings
)
{


    public async Task<ApiResult> Create(CommentAddRequest input)
    {
        var blog = await _context.Blogs
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Slug == input.BlogSlug);

        if (blog == null)
            return ApiError.Failure(Messages.NotFound);

        var commenter = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == _currentUserService.Id) ?? throw new Exception("Kullanıcı bulunamadı.");

        var newComment = new Comment
        {
            BlogId = blog.Id,
            Content = input.Content,
            UserId = _currentUserService.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null
        };

        _context.Comments.Add(newComment);
        await _context.SaveChangesAsync();
        
        var emailMessage = new EmailMessage
        {
            To = blog.User.Email,
            Subject = "Yeni Yorum",
            Body = $"'{blog.Title}' başlıklı blog yazına {commenter.FullName} yorum yapıldı.."
        };

        // await _emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);

        return ApiResult.Success();
    }
    
    public async Task<ApiResultPagination<CommentListResponse>> GetByBlogId(string slug, FilterModel filter)
    {
        var comments = _context.Comments
            .Where(x => x.Blog.Slug == slug)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new CommentListResponse
            (
                x.Id,
                x.Content,
                x.CreatedAt,
                x.User.FullName,
                x.UpdatedAt,
                baseSettings.BackendUrl + "/api/file/image/" + x.User.FileUrl,
                x.UserId == _currentUserService.Id
            ));

        return await comments.PaginatedListAsync(filter.PageNumber, filter.PageSize);
    }
    
    public async Task<ApiResult> Update(CommentAddRequest input)
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