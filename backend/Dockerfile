FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["BlogApi.API/BlogApi.API.csproj", "BlogApi.API/"]
COPY ["BlogApi.Application/BlogApi.Application.csproj", "BlogApi.Application/"]
COPY ["BlogApi.Core/BlogApi.Core.csproj", "BlogApi.Core/"]
COPY ["BlogApi.Infrastructure/BlogApi.Infrastructure.csproj", "BlogApi.Infrastructure/"]
RUN dotnet restore "BlogApi.API/BlogApi.API.csproj"
COPY . ../
WORKDIR /src/BlogApi.API
RUN dotnet build "BlogApi.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish --no-restore -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
ENV ASPNETCORE_HTTP_PORTS=5001
EXPOSE 5001
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BlogApi.API.dll"]