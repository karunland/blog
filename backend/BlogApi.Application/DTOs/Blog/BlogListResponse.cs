using BlogApi.Core.Enums;

namespace BlogApi.Application.DTOs.Blog;

public record BlogListResponse
(
    int Id,
    string Title,
    string Content,
    string Slug,
    DateTime CreatedAt,
    string AuthorName,
    string AuthorPhoto,
    string CategoryName,
    int CategoryId,
    int ViewCount,
    BlogStatusEnum StatusEnumId,
    string Status,
    string ImageUrl,
    int CommentCount,
    int LikeCount,
    bool Liked
);
