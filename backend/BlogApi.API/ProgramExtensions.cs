using System.Text;
using BlogApi.Application.Common.Settings;
using BlogApi.Application.Helper;
using BlogApi.Application.Interfaces;
using BlogApi.Application.Services;
using BlogApi.Core.Interfaces;
using BlogApi.Infrastructure.Persistence;
using BlogApi.Infrastructure.Persistence.Repositories;
using BlogApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace BlogApi;

public static class ProgramExtensions
{
    public static IServiceCollection AddStartupServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddHttpContextAccessor();
        services.Configure<BaseSettings>(configuration.GetSection("BaseSettings"));
        // use postgresql
        var connectionString = configuration.GetConnectionString("BlogConnection");
        Console.WriteLine(connectionString);
        if (connectionString != null)
            services.AddDbContext<BlogContext>(options =>
            {
                 options.UseNpgsql(connectionString);
            });
        
        // Add Memory Cache
        services.AddMemoryCache();
        
        services.AddScoped<BlogRepo>();
        services.AddScoped<UserRepo>();
        services.AddScoped<CategoryRepo>();
        services.AddScoped<CommentRepo>();
        services.AddScoped<FileRepo>();
        services.AddScoped<DashboardRepo>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<BaseSettings>();
        services.AddScoped<IEmailService, EmailService>();

        services.AddHttpClient<GoogleAuthService>();
        services.AddScoped<GoogleAuthService>();
        services.AddScoped<TokenHelper>();
                
        services.AddSwaggerGen(swagger =>
        {
            swagger.SwaggerDoc("v1",
                new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Blog API",
                    Description = ""
                });
            swagger.AddSecurityDefinition("Bearer",
                new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "ONLY TOKEN"
                });
            swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                    },
                    Array.Empty<string>()
                }
            });
        });
        
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll",
                builder =>
                {
                    builder
                        .WithOrigins(
                            "http://localhost:3000",
                            "http://localhost:3001",
                            "http://127.0.0.1:3000",
                            "http://127.0.0.1:3001",
                            "http://localhost:5000",
                            "http://127.0.0.1:5000",
                            "https://devnotes.online",
                            "https://hkorkmaz.com"
                        )
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
        });

        services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey =
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["BaseSettings:JwtSecret"]!)),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });

        return services;
    }

    public static async Task<IApplicationBuilder> UseAppServicesAsync(this IApplicationBuilder app,
        IConfiguration configuration,
        IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Blog API V1");
                c.DocumentTitle = "Blog API - Swagger UI";
                c.EnableTryItOutByDefault();
                c.InjectStylesheet("/swagger-ui/custom.css");
            });

            // Serve the custom CSS file
            app.UseStaticFiles();
        }

        using var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();
        var blogContext = scope.ServiceProvider.GetRequiredService<BlogContext>();
        await blogContext.Database.MigrateAsync();
        blogContext.SeedDatabase();
        
        // CORS middleware'i environment'a göre yapılandır
        app.UseCors("AllowAll");
        
        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });

        return app;
    }
}
