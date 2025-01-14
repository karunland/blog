namespace BlogApi.Core.Entities;

public class VerificationCodes : BaseEntity
{
    public string Code { get; set; }
    public string Email { get; set; }
    public DateTime ExpirationDate { get; set; }
    public bool IsUsed { get; set; }
    public User User { get; set; }
}
