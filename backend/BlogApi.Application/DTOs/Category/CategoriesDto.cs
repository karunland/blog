namespace BlogApi.Application.DTOs.Category;

public record CategoriesDto
{
    public string Name { get; set; }
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public int BlogsCount { get; set; }
}
