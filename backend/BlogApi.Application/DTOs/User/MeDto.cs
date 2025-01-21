namespace BlogApi.Application.DTOs.User;

public class MeDto
{
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Token { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsMailVerified { get; set; }
    public ExternalProviderEnum ExternalProviderId { get; set; }
    public string ExternalProvider { get; set; }
}
