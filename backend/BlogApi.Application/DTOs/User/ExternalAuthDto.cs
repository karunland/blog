namespace BlogApi.Application.DTOs.User;

public class ExternalAuthDto
{
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ExternalId { get; set; }
    public string ExternalProvider { get; set; }
    public string ExternalPictureUrl { get; set; }
}