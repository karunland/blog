using BlogApi.Core.Entities;

namespace BlogApi.Core.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = false);
} 