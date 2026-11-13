using Loxena.Application.Interfaces;
using Loxena.Application.Stocks.TransferStock;
using Loxena.Domain.Entities;
using Loxena.Infrastructure;
using Loxena.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Loxena.IntegrationTests;

[Collection("Database collection")]
public sealed class TransferStockIntegrationTests
{
    private readonly DatabaseFixture _fixture;

    public TransferStockIntegrationTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task Should_Transfer_Stock_Successfully_In_Real_Database()
    {
        // Arrange
        var categoria = new Category($"Integration-{Guid.NewGuid():N}");
        var produto = new Product(
            $"Produto de integração {Guid.NewGuid():N}",
            "Produto sintético para teste",
            12.50m,
            categoria.Id);
        var origem = new Location($"SRC-{Guid.NewGuid():N}", "Origem de teste");
        var destino = new Location($"DST-{Guid.NewGuid():N}", "Destino de teste");

        await using (var contextoInicial = CreateDbContext())
        {
            contextoInicial.Categories.Add(categoria);
            contextoInicial.Products.Add(produto);
            contextoInicial.Locations.AddRange(origem, destino);
            contextoInicial.Stocks.Add(new Stock(produto.Id, origem.Id, 10));

            await contextoInicial.SaveChangesAsync();
        }

        var servicos = new ServiceCollection();
        servicos.AddDbContext<LoxenaDbContext>(options =>
            options.UseSqlServer(_fixture.ConnectionString));
        servicos.AddInfrastructure();

        using var provedor = servicos.BuildServiceProvider();
        using var escopo = provedor.CreateScope();

        var casoDeUso = new TransferStockUseCase(
            escopo.ServiceProvider.GetRequiredService<IStockRepository>(),
            escopo.ServiceProvider.GetRequiredService<IProductRepository>(),
            escopo.ServiceProvider.GetRequiredService<ILocationRepository>(),
            escopo.ServiceProvider.GetRequiredService<IUnitOfWork>());

        // Act
        await casoDeUso.ExecuteAsync(new TransferStockRequest
        {
            ProductId = produto.Id,
            SourceLocationId = origem.Id,
            TargetLocationId = destino.Id,
            Amount = 5
        });

        // Assert
        await using var contextoDeVerificacao = CreateDbContext();

        var estoqueOrigem = await contextoDeVerificacao.Stocks.SingleAsync(
            estoque => estoque.ProductId == produto.Id &&
                       estoque.LocationId == origem.Id);
        var estoqueDestino = await contextoDeVerificacao.Stocks.SingleAsync(
            estoque => estoque.ProductId == produto.Id &&
                       estoque.LocationId == destino.Id);

        Assert.Equal(5, estoqueOrigem.PhysicalQuantity);
        Assert.Equal(5, estoqueDestino.PhysicalQuantity);
    }

    private LoxenaDbContext CreateDbContext()
    {
        var opcoes = new DbContextOptionsBuilder<LoxenaDbContext>()
            .UseSqlServer(_fixture.ConnectionString)
            .Options;

        return new LoxenaDbContext(opcoes);
    }
}
