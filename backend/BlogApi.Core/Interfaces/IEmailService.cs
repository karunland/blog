using BlogApi.Core.Entities;

namespace BlogApi.Core.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(EmailMessage emailMessage);
} 