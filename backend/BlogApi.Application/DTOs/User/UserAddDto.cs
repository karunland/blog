
using Microsoft.AspNetCore.Http;

namespace BlogApi.Application.DTOs.User;

public record UserAddDto
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public IFormFile? Image { get; set; }
}
