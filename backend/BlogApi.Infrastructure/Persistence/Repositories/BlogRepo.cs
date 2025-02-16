﻿using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs;
using BlogApi.Application.DTOs.Blog;
using BlogApi.Application.DTOs.File;
using BlogApi.Application.Interfaces;
using BlogApi.Core.Entities;
using BlogApi.Core.Enums;
using BlogApi.Core.Interfaces;
using BlogApi.Infrastructure.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class BlogRepo
{
    private readonly BlogContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly FileRepo _fileRepo;
    private readonly IEmailService _emailService;
    private readonly BaseSettings _baseSettings;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMemoryCache _cache;
    private const string BLOG_LIST_CACHE_KEY = "BLOG_LIST";

    public BlogRepo(
        BlogContext context,
        ICurrentUserService currentUserService,
        FileRepo fileRepo,
        IEmailService emailService,
        BaseSettings baseSettings,
        IHttpContextAccessor httpContextAccessor,
        IMemoryCache cache)
    {
        _context = context;
        _currentUserService = currentUserService;
        _fileRepo = fileRepo;
        _emailService = emailService;
        _baseSettings = baseSettings;
        _httpContextAccessor = httpContextAccessor;
        _cache = cache;
    }

    public async Task<ApiResultPagination<BlogListResponse>> GetAll(BlogFilterModel filter)
    {
        var cacheKey = $"{BLOG_LIST_CACHE_KEY}_{filter.PageNumber}_{filter.PageSize}_{filter.Search}_{filter.CategoryId}_{filter.SortBy}";
        
        if (_cache.TryGetValue(cacheKey, out ApiResultPagination<BlogListResponse> cachedResult))
        {
            return cachedResult;
        }

        var query = _context.Blogs
            .Where(x => !x.IsDeleted && x.BlogStatusEnum == BlogStatusEnum.Published)
            .AsQueryable();

        if (!string.IsNullOrEmpty(filter.Search)) 
            query = query.Where(x => x.Title.Contains(filter.Search));

        if (!string.IsNullOrEmpty(filter.CategoryId))
            query = query.Where(x => x.CategoryId == int.Parse(filter.CategoryId));

        query = filter.SortBy switch
        {
            BlogSortType.Oldest => query.OrderBy(x => x.CreatedAt),
            BlogSortType.MostViewed => query.OrderByDescending(x => x.ViewCount),
            BlogSortType.MostCommented => query.OrderByDescending(x => x.Comments.Count),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };

        var result = query.Select(x => new BlogListResponse
        (
            x.Id,
            x.Title,
            x.Content,
            x.Slug,
            x.CreatedAt,
            x.User.FullName,
            x.User.ExternalProvider == ExternalProviderEnum.Google && x.User.FileUrl != null && x.User.FileUrl.StartsWith("http") ? x.User.FileUrl : _baseSettings.BackendUrl + "/api/file/image/" + x.User.FileUrl,
            x.Category.Name,
            x.CategoryId,
            _context.Views.Count(v => v.BlogId == x.Id),
            x.BlogStatusEnum,
            x.BlogStatusEnum.ToString(),
            _baseSettings.BackendUrl + "/api/file/image/" + x.ImageUrl,
            x.Comments.Count,
            x.Likes.Count,
            x.Likes.Any(l => l.UserId == _currentUserService.Id && !l.IsDeleted)
        ));

        var paginatedResult = await result.PaginatedListAsync(filter.PageNumber, filter.PageSize);
        
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetSlidingExpiration(TimeSpan.FromMinutes(10))
            .SetAbsoluteExpiration(TimeSpan.FromHours(1));
            
        _cache.Set(cacheKey, paginatedResult, cacheOptions);

        return paginatedResult;
    }

    private void InvalidateCache()
    {
        _cache.Remove(BLOG_LIST_CACHE_KEY); 
    }

    public async Task<ApiResult> Create(BlogAddRequest blog)
    {
        var baseSlug = blog.Title.ToLower()
            .Replace(" ", "-")
            .Replace("ğ", "g")
            .Replace("ü", "u")
            .Replace("ş", "s")
            .Replace("ı", "i")
            .Replace("ö", "o")
            .Replace("ç", "c")
            .Replace("-", " ")
            .Trim()
            .Replace(" ", "-");

        var slug = baseSlug;
        var counter = 1;

        while (await _context.Blogs.AnyAsync(x => x.Slug == slug))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        var newBlog = new Blog
        {
            Title = blog.Title,
            Content = blog.Content,
            UserId = _currentUserService.Id,
            BlogStatusEnum = Enum.Parse<BlogStatusEnum>(blog.Status),
            CategoryId = int.Parse(blog.CategoryId),
            Slug = slug,
            CreatedAt = DateTime.UtcNow
        };

        if (blog.Image != null)
        {
            var imagePath = await _fileRepo.UploadFileAsync(new UploadFileAsyncDto {
                File = blog.Image,
                Type = FileTypeEnum.Thumbnail
            });
            newBlog.ImageUrl = imagePath.FileUrl;
        }

        _context.Blogs.Add(newBlog);
        await _context.SaveChangesAsync();

        var emailMessage = new EmailMessage
        {
            To = _currentUserService.Email,
            Subject = "Yeni Blog Oluşturuldu",
            Body = $"'{blog.Title}' başlıklı blog yazınız başarıyla oluşturuldu."
        };

        await _emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);

        InvalidateCache();
        return ApiResult.Success();
    }

    public async Task<ApiResult> Update(BlogUpdateRequest blog)
    {
        var blogToUpdate = await _context.Blogs
            .FirstOrDefaultAsync(x => x.Id == blog.Id && x.UserId == _currentUserService.Id);

        if (blogToUpdate == null) 
            return ApiError.Failure("Blog bulunamadı veya düzenleme yetkiniz yok.");

        if (string.IsNullOrWhiteSpace(blog.Title) || string.IsNullOrWhiteSpace(blog.Content))
            return ApiError.Failure("Başlık ve içerik alanları zorunludur.");

        try
        {
            blogToUpdate.Title = blog.Title;
            blogToUpdate.Content = blog.Content;
            blogToUpdate.CategoryId = blog.CategoryId;
            blogToUpdate.BlogStatusEnum = blog.Status;
            blogToUpdate.UpdatedAt = DateTime.UtcNow;

            if (blog.Image != null)
            {
                var imagePath = await _fileRepo.UploadFileAsync(new UploadFileAsyncDto {
                    File = blog.Image,
                    Type = FileTypeEnum.Thumbnail
                });
                blogToUpdate.ImageUrl = imagePath.FileUrl;
            }

            await _context.SaveChangesAsync();
            InvalidateCache();
            return ApiResult.Success();
        }
        catch (Exception ex)
        {
            return ApiError.Failure("Blog güncellenirken bir hata oluştu: " + ex.Message);
        }
    }

    public async Task<ApiResult> Delete(string slug)
    {
        var blogToDelete = await _context.Blogs.FirstOrDefaultAsync(x => x.Slug == slug && x.UserId == _currentUserService.Id);

        if (blogToDelete == null) return ApiError.Failure(Messages.NotFound);

        blogToDelete.IsDeleted = true;
        blogToDelete.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var emailMessage = new EmailMessage
        {
            To = _currentUserService.Email,
            Subject = "Blog Silindi",
            Body = "Blog silindi."
        };

        await _emailService.SendEmailAsync(emailMessage.To, emailMessage.Subject, emailMessage.Body);

        InvalidateCache();
        return ApiResult.Success();
    }

    public async Task<ApiResult<BlogListResponse>> Detail(string slug)
    {
        var blog = await _context.Blogs
            .Where(x => x.Slug == slug)
            .Select(x => new BlogListResponse
            (
                x.Id,
                x.Title,
                x.Content,
                x.Slug,
                x.CreatedAt,
                x.User.FullName,
                x.User.ExternalProvider == ExternalProviderEnum.Google && x.User.FileUrl != null && x.User.FileUrl.StartsWith("http") ? x.User.FileUrl : _baseSettings.BackendUrl + "/api/file/image/" + x.User.FileUrl,
                x.Category.Name,
                x.CategoryId,
                _context.Views.Count(v => v.BlogId == x.Id), // View count'u direkt olarak sorguda hesapla
                x.BlogStatusEnum,
                x.BlogStatusEnum.ToString(),
                _baseSettings.BackendUrl + "/api/file/image/" + x.ImageUrl,
                x.Comments.Where(x => !x.IsDeleted).Count(),
                x.Likes.Count,
                x.Likes.Any(l => l.UserId == _currentUserService.Id && !l.IsDeleted)
            ))
            .FirstOrDefaultAsync();

        if (blog == null) return ApiError.Failure();
        
        var forwardedFor = _httpContextAccessor.HttpContext.Request.Headers["X-Forwarded-For"];
        var ipAddress = forwardedFor.Count > 0 ? forwardedFor[0] : _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();

        if (!await _context.Views.AnyAsync(x => x.BlogId == blog.Id && x.IpAddress == ipAddress))
        {
            _context.Views.Add(new View{
                BlogId = blog.Id,
                IpAddress = ipAddress,
            });
            await _context.SaveChangesAsync();
            
            // View count'u güncelle
            blog = blog with { ViewCount = blog.ViewCount + 1 };
        }

        return blog;
    }

    public async Task<ApiResult<List<BlogListResponse>>> Search(string search)
    {
        var blogs = _context.Blogs
            .Where(x => x.Title.Contains(search) || x.Content.Contains(search) || x.Slug.Contains(search))
            .OrderByDescending(x => x.CreatedAt);

        return await blogs.Select(x => new BlogListResponse
        (
            x.Id,
            x.Title,
            x.Content,
            x.Slug,
            x.CreatedAt,
            x.User.FullName,
            x.User.ExternalProvider == ExternalProviderEnum.Google && x.User.FileUrl != null && x.User.FileUrl.StartsWith("http") 
                ? x.User.FileUrl : _baseSettings.BackendUrl + "/api/file/image/" + x.User.FileUrl,
            x.Category.Name,
            x.CategoryId,
            _context.Views.Count(x => x.BlogId == x.Id),
            x.BlogStatusEnum,
            x.BlogStatusEnum.ToString(),
            _baseSettings.BackendUrl + "/api/file/image/" + x.ImageUrl,
            x.Comments.Count,
            x.Likes.Count,
            x.Likes.Any(l => l.UserId == _currentUserService.Id && !l.IsDeleted)
        )).ToListAsync();
    }

    public async Task<ApiResult> ChangeStatus(ChangeStatusRequest request)
    {
        var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.Slug == request.slug && x.UserId == _currentUserService.Id);

        if (blog == null) return ApiError.Failure("Blog bulunamadı veya düzenleme yetkiniz yok.");

        blog.BlogStatusEnum = (BlogStatusEnum)request.status;
        blog.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ApiResult.Success();
    }

    public async Task<ApiResult<LikeResponse>> ToggleLikeBlog(LikeRequest request)
    {
        var blog = await _context.Blogs.Where(x => x.Slug == request.slug).FirstOrDefaultAsync();  

        if (blog == null) return ApiError.Failure("Blog bulunamadı");

        var likesOfUser = await _context.Likes.Where(x => x.BlogId == blog.Id && x.UserId == _currentUserService.Id && !x.IsDeleted).ToListAsync();
        var isLiked = false;
        if (!likesOfUser.Any())
        {
            _context.Likes.Add(new Like {
                UserId = _currentUserService.Id,
                BlogId = blog.Id
            });
            isLiked = true;
        }
        else
        {
            _context.Likes.RemoveRange(likesOfUser);
            isLiked = false;
        }

        var res = await _context.SaveChangesAsync();

        if (res > 0)
        {   
            var likeCount = await _context.Likes.AsNoTracking().CountAsync(x => x.BlogId == blog.Id && x.UserId == _currentUserService.Id);
            return new LikeResponse(isLiked, likeCount);
        }
        else
        {
            return ApiError.Failure("Blog beğenilirken bir hata oluştu");
        }
    }
}