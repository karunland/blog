
namespace BlogApi.Core.Entities;

public sealed class View
{
    public int Id { get; set; }
    public int BlogId { get; set; }
    public string IpAddress { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Blog Blog { get; set; }
    public bool IsDeleted { get; set; } = false;
}
