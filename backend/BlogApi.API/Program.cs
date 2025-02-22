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

builder.Services.AddCors(options =>
{
    options.AddPolicy("Dev",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:3000", "https://devnotes.online",
                "https://hkorkmaz.com")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });

    options.AddPolicy("Prod",
        builder =>
        {
            builder
                .WithOrigins("https://devnotes.online", "https://hkorkmaz.com")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseCors("Dev");
}
else
{
    app.UseCors("Prod");
}

await app.UseAppServicesAsync(configuration, app.Environment);

app.Run();
