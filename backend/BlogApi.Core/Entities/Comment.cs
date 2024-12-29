namespace BlogApi.Core.Entities;

public class Comment
{
    public int Id { get; set; }
    public string Content { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public int BlogId { get; set; }
    public Blog Blog { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}
