# Çalışma dizini ve proje yollarına uygun Dockerfile

# 1. Temel imaj: SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release

# 2. Çalışma dizini belirleme
WORKDIR /src

# 3. Proje dosyasını kopyalama ve restore etme
COPY ["BlogApi.API/BlogApi.API.csproj", "BlogApi.API/"]
RUN dotnet restore "BlogApi.API/BlogApi.API.csproj"

# 4. Tüm kodu kopyalama
COPY . .

# 5. API projesi dizinine geçiş ve build işlemi
WORKDIR "/src/BlogApi.API"
RUN dotnet build "BlogApi.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# 6. Yayın için publish işlemi
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "BlogApi.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# 7. Çalıştırma imajı
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://*:5055
ENV ASPNETCORE_ENVIRONMENT=Development
EXPOSE 5055
# 8. Uygulamayı başlat
ENTRYPOINT ["dotnet", "BlogApi.API.dll"]
