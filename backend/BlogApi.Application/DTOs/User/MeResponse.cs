
namespace BlogApi.Application.DTOs.User;

public record MeResponse
(
    string Email,
    string FirstName,
    string LastName,
    string Token,
    string? ImageUrl,
    bool IsMailVerified,
    ExternalProviderEnum ExternalProviderId,
    string ExternalProvider
);

