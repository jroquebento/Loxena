using Loxena.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Testcontainers.MsSql;

namespace Loxena.IntegrationTests;

public sealed class DatabaseFixture : IAsyncLifetime
{
    private readonly MsSqlContainer _container =
        new MsSqlBuilder("mcr.microsoft.com/mssql/server:2025-latest").Build();

    public string ConnectionString { get; private set; } = string.Empty;

    public async Task InitializeAsync()
    {
        await _container.StartAsync();

        ConnectionString = _container.GetConnectionString();
        var options = new DbContextOptionsBuilder<LoxenaDbContext>()
            .UseSqlServer(ConnectionString)
            .Options;

        await using var dbContext = new LoxenaDbContext(options);
        await dbContext.Database.MigrateAsync();
    }

    public Task DisposeAsync() => _container.DisposeAsync().AsTask();
}
