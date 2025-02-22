using BlogApi.Core.Enums;

namespace BlogApi.Application.DTOs.Blog;

public record ListResponse
(
    int Id,
    string Title,
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
    bool Liked,
    int UserId
);
