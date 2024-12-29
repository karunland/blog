namespace BlogApi.Application.DTOs.Comment;

public record CommentsDto
{
    public int Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthorName { get; set; }
    public DateTime? UpdatedAt { get; set; }
}