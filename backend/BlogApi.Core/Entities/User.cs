﻿using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace BlogApi.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string Email { get; set; }
    public string? Password { get; set; }
    public string? FileUrl { get; set; }
    public string? FileName { get; set; }
    public string? Extension { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;    
    public DateTime? DeletedAt { get; set; }
    
    // External Authentication Properties
    public string? ExternalId { get; set; }
    public string? ExternalProvider { get; set; }
    public string? ExternalPictureUrl { get; set; }
    public bool IsExternalAuth { get; set; } = false;
    
    [NotMapped]
    public string FullName
    {
        get
        {
            return CultureInfo.CurrentCulture.TextInfo.ToTitleCase($"{FirstName} {LastName}");
        }
    }
}