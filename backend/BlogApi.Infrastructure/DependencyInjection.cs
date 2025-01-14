using BlogApi.Core.Interfaces;
using BlogApi.Infrastructure.Persistence.Repositories;
using BlogApi.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BlogApi.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<FileRepo>();
        return services;
    }
}