namespace BlogApi.Application.Interfaces;

public interface ICurrentUserService
{
    public int Id { get; }
    public string FirstName { get; }
    public string LastName { get; }
    public string Email { get; }
}
