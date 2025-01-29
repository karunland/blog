using BlogApi;
using BlogApi.Infrastructure;
using BlogApi.Core.Settings;
using BlogApi.Application.Services;
using BlogApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
var builder = WebApplication.CreateBuilder(args);
var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{environment}.json", optional: true)
    .AddEnvironmentVariables()
    .Build();

builder.Services.AddStartupServices(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);

// Email settings configuration
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:3000") // React uygulamanızın adresi
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

// builder.Services.AddScoped<ContentModerationService>();

var app = builder.Build();
await app.UseAppServicesAsync(configuration, app.Environment);

// Use CORS before other middleware
app.UseCors("AllowReactApp");

app.Run();
