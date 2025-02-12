
namespace BlogApi.Application.DTOs.Comment;

public record CommentListResponse
(
    int Id,
    string Content,
    DateTime CreatedAt,
    string AuthorName,
    DateTime? UpdatedAt,
    string AuthorImageUrl,
    bool IsMyComment
);
