using System.Net;
using System.Net.Mail;
using BlogApi.Core.Entities;
using BlogApi.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using BlogApi.Core.Settings;

namespace BlogApi.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
    {
        _emailSettings = emailSettings.Value;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailSettings.DisplayName, _emailSettings.Email));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;

            var builder = new BodyBuilder();
            if (isHtml)
                builder.HtmlBody = body;
            else
                builder.TextBody = body;
            message.Body = builder.ToMessageBody();

            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            
            // SSL/TLS ayarları
            await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, 
                SecureSocketOptions.StartTls);

            // Gmail için authentication
            await smtp.AuthenticateAsync(_emailSettings.Email, _emailSettings.Password);
            
            // Email gönderme
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);

            _logger.LogInformation($"Email sent successfully to {to}");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Email sending failed: {ex.Message}");
            throw;
        }
    }
} 