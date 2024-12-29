using Microsoft.AspNetCore.Mvc;
using BlogApi.Application.DTOs;
using BlogApi.Infrastructure.Persistence.Repositories;

namespace BlogApi.Controllers;

public class DashboardController(DashboardRepo dashboardService) : BaseApiController
{
    [HttpGet]
    public async Task<ApiResult<DashboardStatsDto>> GetStats()
    {
        return await dashboardService.GetUserStats();
    }
}