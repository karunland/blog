using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Application.DTOs.File;
using BlogApi.Application.Interfaces;
using BlogApi.Core.Entities;
using BlogApi.Core.Enums;
using BlogApi.Core.Interfaces;
using BlogApi.Utilities;
using Microsoft.EntityFrameworkCore;
using BlogApi.Application.Helper;
using BlogApi.Application.Services;
using BlogApi.Infrastructure.Services;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class BlogRepo(BlogContext context, ICurrentUserService currentUserService, FileRepo fileRepo, IEmailService emailService, BaseSettings baseSettings)
{
    public async Task<ApiResultPagination<BlogsDto>> GetAll(BlogFilterModel filter)
    {
        var query = context.Blogs.AsQueryable();

        if (!string.IsNullOrEmpty(filter.Search)) 
            query = query.Where(x => x.Title.Contains(filter.Search));

        if (!string.IsNullOrEmpty(filter.CategoryId))
            query = query.Where(x => x.CategoryId == int.Parse(filter.CategoryId));

        query = filter.SortBy switch
        {
            BlogSortType.Oldest => query.OrderBy(x => x.CreatedAt),
            BlogSortType.MostViewed => query.OrderByDescending(x => x.ViewCount),
            BlogSortType.MostCommented => query.OrderByDescending(x => x.Comments.Count),
            _ => query.OrderByDescending(x => x.CreatedAt) // Newest varsayılan
        };

        var result = query.Select(x => new BlogsDto
        {
            Id = x.Id,
            Title = x.Title,
            CreatedAt = x.CreatedAt,
            AuthorName = x.User.FullName,
            Slug = x.Slug,
            CategoryName = x.Category.Name,
            ViewCount = x.ViewCount,
            ImageUrl = baseSettings.BackendUrl + "/api/file/image/" + x.ImageUrl,
            CommentCount = x.Comments.Count
        });

        return await result.PaginatedListAsync(filter.PageNumber, filter.PageSize);
    }

    public async Task<ApiResult> Create(BlogAddDto blog)
    {
        // İçerik kontrolü
        // var contentCheck = await contentModerationService.CheckTextContent(blog.Content);
        // if (!contentCheck.isAppropriate)
        //     return ApiError.Failure(contentCheck.reason);

        var newBlog = new Blog
        {
            Title = blog.Title,
            Content = blog.Content,
            UserId = currentUserService.Id,
            BlogStatusEnum = Enum.Parse<BlogStatusEnum>(blog.Status),
            CategoryId = int.Parse(blog.CategoryId),
            Slug = blog.Slug,
            CreatedAt = DateTime.UtcNow
        };

        if (blog.Image != null)
        {
            // Resim içerik kontrolü
            using var memoryStream = new MemoryStream();
            await blog.Image.CopyToAsync(memoryStream);
            // var imageCheck = await contentModerationService.CheckImage(memoryStream.ToArray());
            // if (!imageCheck.isAppropriate)
            //     return ApiError.Failure(imageCheck.reason);

            var imagePath = await fileRepo.UploadFileAsync(new UploadFileAsyncDto {
                File = blog.Image,
                Type = FileTypeEnum.Thumbnail
            });
            newBlog.ImageUrl = imagePath.FileUrl;
        }

        context.Blogs.Add(newBlog);
        await context.SaveChangesAsync();

        var emailMessage = new EmailMessage
        {
            To = currentUserService.Email,
            Subject = "Yeni Blog Oluşturuldu",
            Body = "Yeni blog oluşturuldu."
        };

        await emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);

        return ApiResult.Success();
    }

    public async Task<ApiResult> Update(BlogUpdateDto blog)
    {
        var blogToUpdate = await context.Blogs
            .FirstOrDefaultAsync(x => x.Id == blog.Id && x.UserId == currentUserService.Id);

        if (blogToUpdate == null) return ApiError.Failure("Blog bulunamadı veya düzenleme yetkiniz yok.");

        blogToUpdate.Title = blog.Title;
        blogToUpdate.Content = blog.Content;
        blogToUpdate.CategoryId = blog.CategoryId;
        blogToUpdate.BlogStatusEnum = blog.Status;
        blogToUpdate.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        var emailMessage = new EmailMessage
        {
            To = currentUserService.Email,
            Subject = "Blog Güncellendi",
            Body = "Blog güncellendi."
        };

        await emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);

        return ApiResult.Success();
    }

    public async Task<ApiResult> Delete(string slug)
    {
        var blogToDelete = await context.Blogs.FirstOrDefaultAsync(x => x.Slug == slug && x.UserId == currentUserService.Id);

        if (blogToDelete == null) return ApiError.Failure(Messages.NotFound);

        blogToDelete.IsDeleted = true;
        blogToDelete.DeletedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        var emailMessage = new EmailMessage
        {
            To = currentUserService.Email,
            Subject = "Blog Silindi",
            Body = "Blog silindi."
        };

        await emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);

        return ApiResult.Success();
    }

    public async Task<ApiResult<BlogsDto>> Detail(string slug)
    {
        var blog = await context.Blogs
            .Where(x => x.Slug == slug)
            .Select(x => new BlogsDto
            {
                Id = x.Id,
                Title = x.Title,
                Content = x.Content,
                CreatedAt = x.CreatedAt,
                AuthorName = x.User.FullName,
                Slug = x.Slug,
                CategoryName = x.Category.Name,
                CategoryId = x.CategoryId,
                ViewCount = x.ViewCount,
                StatusEnumId = x.BlogStatusEnum,
                Status = x.BlogStatusEnum.ToString(),
                CommentCount = x.Comments.Where(x => !x.IsDeleted).Count(),
                ImageUrl = baseSettings.BackendUrl + "/api/file/image/" + x.ImageUrl
            })
            .FirstOrDefaultAsync();

        if (blog == null)
            return ApiError.Failure();

        return blog;
    }

    public async Task<ApiResult<List<BlogsDto>>> Search(string search)
    {
        var blogs = context.Blogs
            .Where(x => x.Title.Contains(search) || x.Content.Contains(search) || x.Slug.Contains(search))
            .OrderByDescending(x => x.CreatedAt);

        return await blogs.Select(x => new BlogsDto
        {
            CreatedAt = x.CreatedAt,
            Title = x.Title,
            Slug = x.Slug,
            CategoryName = x.Category.Name,
            AuthorName = x.User.FullName,
        }).ToListAsync();
    }
}