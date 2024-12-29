namespace BlogApi.Core.Entities;

public class File
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Path { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}
