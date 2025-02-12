using Microsoft.AspNetCore.Mvc;
using BlogApi.Application.DTOs;
using BlogApi.Infrastructure.Persistence.Repositories;
using BlogApi.Application.DTOs.Dashboard;

namespace BlogApi.Controllers;

public class DashboardController(DashboardRepo dashboardService) : BaseApiController
{
    [HttpGet]
    public async Task<ApiResult<StatsResponse>> GetStats()
    {
        return await dashboardService.GetUserStats();
    }
}