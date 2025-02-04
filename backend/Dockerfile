FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["BlogApi.API/BlogApi.API.csproj", "BlogApi.API/"]
COPY ["BlogApi.Application/BlogApi.Application.csproj", "BlogApi.Application/"]
COPY ["BlogApi.Core/BlogApi.Core.csproj", "BlogApi.Core/"]
COPY ["BlogApi.Infrastructure/BlogApi.Infrastructure.csproj", "BlogApi.Infrastructure/"]

RUN dotnet restore "BlogApi.API/BlogApi.API.csproj"
COPY . .
WORKDIR /src/BlogApi.API
RUN dotnet build "BlogApi.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BlogApi.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0
ENV ASPNETCORE_HTTP_PORTS=5001
ENV ASPNETCORE_ENVIRONMENT=Development
EXPOSE 5001
WORKDIR /app
COPY --from=publish /app/publish .
COPY ["BlogApi.API/appsettings.json", "appsettings.json"]
COPY ["BlogApi.API/appsettings.Development.json", "appsettings.Development.json"]
COPY ["BlogApi.API/BlogApiFiles", "/app/BlogApiFiles"]
VOLUME ["/app/BlogApiFiles"]
ENTRYPOINT ["dotnet", "BlogApi.API.dll"]