
namespace BlogApi.Application.DTOs.User;

public record UserUpdateRequest(
    string UserName,
    string Email,
    string FirstName,
    string LastName
);
