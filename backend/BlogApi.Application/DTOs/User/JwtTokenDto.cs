
namespace BlogApi.Application.DTOs.User;

public record JwtTokenDto
(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string ImageUrl
);
