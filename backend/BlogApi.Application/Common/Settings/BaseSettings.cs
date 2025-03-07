﻿using Microsoft.Extensions.Configuration;

namespace BlogApi.Application.Common.Settings;


public class BaseSettings(IConfiguration configuration)
{
    public string? JwtSecret => Environment.GetEnvironmentVariable("BaseSettings:JwtSecret") ?? configuration["BaseSettings:JwtSecret"];
    public string? JwtIssuer => Environment.GetEnvironmentVariable("BaseSettings:JwtIssuer") ?? configuration["BaseSettings:JwtIssuer"];
    // google client id and secret
    public string? GoogleClientId => Environment.GetEnvironmentVariable("BaseSettings:GoogleClientId") ?? configuration["BaseSettings:GoogleClientId"];
    public string? GoogleClientSecret => Environment.GetEnvironmentVariable("BaseSettings:GoogleClientSecret") ?? configuration["BaseSettings:GoogleClientSecret"];
    public string? BackendUrl => Environment.GetEnvironmentVariable("BaseSettings:BackendUrl") ?? configuration["BaseSettings:BackendUrl"];
    public string? OpenAIApiKey => Environment.GetEnvironmentVariable("BaseSettings:OpenAIApiKey") ?? configuration["BaseSettings:OpenAIApiKey"];
    public string? Environmnt => Environment.GetEnvironmentVariable("BaseSettings:Environment") ?? configuration["BaseSettings:Environment"];
}
