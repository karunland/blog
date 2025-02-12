
namespace BlogApi.Application.DTOs.Comment;

public record CommentAddRequest
(
    int Id,
    string Content,
    string BlogSlug
);