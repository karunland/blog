using BlogApi.Core.Enums;

namespace BlogApi.Core.Entities;

public class Blog
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }
    public string Content { get; set; }
    public string ImageUrl { get; set; }
    public BlogStatusEnum BlogStatusEnum { get; set; } = BlogStatusEnum.Published;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public User User { get; set; }
    public int UserId { get; set; }
    public Category Category { get; set; }
    public int CategoryId { get; set; }
    public List<Comment> Comments { get; set; } = [];
    public int ViewCount { get; set; } = 0; //TODO: will be deleted
    public List<Like> Likes { get; set; } = [];
}
