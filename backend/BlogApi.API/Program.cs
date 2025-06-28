using BlogApi;
using BlogApi.Infrastructure;
using BlogApi.Core.Settings;

var builder = WebApplication.CreateBuilder(args);
var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();

builder.Services.AddStartupServices(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);

// Email settings configuration
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

var app = builder.Build();

await app.UseAppServicesAsync(configuration, app.Environment);

app.Run();
