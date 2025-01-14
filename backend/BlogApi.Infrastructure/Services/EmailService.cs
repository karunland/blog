using System.Net;
using System.Net.Mail;
using BlogApi.Core.Entities;
using BlogApi.Core.Interfaces;
using Microsoft.Extensions.Configuration;

namespace BlogApi.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;
    private readonly string _senderEmail;
    private readonly string _displayName;

    public EmailService(IConfiguration configuration)
    {
        _smtpHost = "smtp.gmail.com";
        _smtpPort = 587;
        _smtpUsername = configuration["EmailSettings:Username"] ?? throw new ArgumentNullException(nameof(configuration), "Email username is not configured");
        _smtpPassword = configuration["EmailSettings:Password"] ?? throw new ArgumentNullException(nameof(configuration), "Email password is not configured");
        _senderEmail = configuration["EmailSettings:SenderEmail"] ?? throw new ArgumentNullException(nameof(configuration), "Sender email is not configured");
        _displayName = configuration["EmailSettings:DisplayName"] ?? "DevLog Blog";
    }

    public async Task SendEmailAsync(EmailMessage emailMessage)
    {
        ArgumentNullException.ThrowIfNull(emailMessage);
        ArgumentException.ThrowIfNullOrEmpty(emailMessage.To);

        var smtp = new SmtpClient
        {
            Host = _smtpHost,
            Port = _smtpPort,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(_smtpUsername, _smtpPassword)
        };

        using var message = new MailMessage()
        {
            From = new MailAddress(_senderEmail, _displayName),
            Subject = emailMessage.Subject ?? string.Empty,
            Body = emailMessage.Body ?? string.Empty,
            IsBodyHtml = emailMessage.IsHtml
        };
        
        message.To.Add(emailMessage.To);

        try 
        {
            await smtp.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to send email: {ex.Message}", ex);
        }
    }
} 