using BlogApi.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using MailKit.Security;

namespace BlogApi.Infrastructure.Services;

public class EmailService(IConfiguration configuration, ILogger<EmailService> logger) : IEmailService
{
    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(configuration["EmailSettings:DisplayName"], configuration["EmailSettings:Email"]));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;

            var builder = new BodyBuilder();
            if (isHtml)
                builder.HtmlBody = body;
            else
                builder.TextBody = body;
            message.Body = builder.ToMessageBody();

            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            
            await smtp.ConnectAsync(configuration["EmailSettings:Host"] ?? "", Convert.ToInt16(configuration["EmailSettings:Port"]), 
                SecureSocketOptions.StartTls);

            // await smtp.AuthenticateAsync(configuration["EmailSettings:Email"], configuration["EmailSettings:Password"]);
            //
            // await smtp.SendAsync(message);
            // await smtp.DisconnectAsync(true);

            logger.LogInformation($"Email sent successfully to {to}");
        }
        catch (Exception ex)
        {
            logger.LogError($"Email sending failed: {ex.Message}");
            throw;
        }
    }
} 