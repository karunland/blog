using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace BlogApi.Core.Entities;

public class User : BaseEntity
{
    public string Username { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string Email { get; set; }
    public string? Password { get; set; }
    public string? FileUrl { get; set; }
    public string? FileName { get; set; }
    public string? Extension { get; set; }
    public bool IsDeleted { get; set; } = false;    
    public DateTime? DeletedAt { get; set; }
    public bool IsMailVerified { get; set; } = false;
    
    // External Authentication Properties
    public string? ExternalId { get; set; }
    public ExternalProviderEnum ExternalProvider { get; set; } = ExternalProviderEnum.None;
    public string? ExternalPictureUrl { get; set; }
    public bool IsExternalAuth { get; set; } = false;
    public bool IsGoogleRegister { get; set; } = false;

    [NotMapped]
    public string FullName => CultureInfo.CurrentCulture.TextInfo.ToTitleCase($"{FirstName} {LastName}");
}