FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Loxena.Api/Loxena.Api.csproj", "Loxena.Api/"]
COPY ["Loxena.Application/Loxena.Application.csproj", "Loxena.Application/"]
COPY ["Loxena.Domain/Loxena.Domain.csproj", "Loxena.Domain/"]
COPY ["Loxena.Infrastructure/Loxena.Infrastructure.csproj", "Loxena.Infrastructure/"]

RUN dotnet restore "Loxena.Api/Loxena.Api.csproj"

COPY . .
WORKDIR /src/Loxena.Api
RUN dotnet publish "Loxena.Api.csproj" -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Loxena.Api.dll"]
