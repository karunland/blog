using BlogApi;
using BlogApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddStartupServices(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

await app.UseAppServicesAsync(app.Environment);

app.Run();
