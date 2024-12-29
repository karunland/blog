using Microsoft.Extensions.Configuration;

namespace BlogApi.Application.Common.Settings;


public class BaseSettings(IConfiguration configuration)
{
    public string? JwtSecret => Environment.GetEnvironmentVariable("BaseSettings:JwtSecret") ?? configuration["BaseSettings:JwtSecret"];
}
