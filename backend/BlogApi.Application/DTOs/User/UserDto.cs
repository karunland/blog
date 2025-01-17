﻿namespace BlogApi.Application.DTOs.User;

public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsMailVerified { get; set; }
}

