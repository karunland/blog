namespace BlogApi.Application.DTOs.Comment;

public record CommentAddDto
{
    public int Id { get; set; }
    public string Content { get; set; }
    public string BlogSlug { get; set; }
}