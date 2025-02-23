﻿
namespace BlogApi.Application.DTOs.User;

public record UserDto
(
    int Id,
    string Email,
    string FirstName,
    string LastName,
    string UserName,
    string? ImageUrl,
    bool IsMailVerified,
    ExternalProviderEnum ExternalProviderId,
    string ExternalProvider
);
