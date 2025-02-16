
namespace BlogApi.Core.Entities;

public class Like
{
    public int Id { get; set; }
    public int BlogId { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Blog Blog { get; set; }
    public User User { get; set; }
    public bool IsDeleted { get; set; } = false;
}
