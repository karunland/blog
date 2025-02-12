
namespace BlogApi.Application.DTOs.User;

public record ExternalAuthRequest
(
    string Email,
    string FirstName,
    string LastName,
    string ExternalId,
    string ExternalProvider,
    string ExternalPictureUrl
);
