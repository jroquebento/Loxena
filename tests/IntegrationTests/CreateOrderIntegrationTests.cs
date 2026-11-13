using Loxena.Application.Orders.CreateOrder;
using Loxena.Domain.Entities;
using Loxena.Domain.Enums;
using Loxena.Infrastructure;
using Loxena.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Loxena.IntegrationTests;

[Collection("Database collection")]
public sealed class CreateOrderIntegrationTests
{
    private readonly DatabaseFixture _fixture;

    public CreateOrderIntegrationTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task Should_Create_Order_Successfully_In_Real_Database()
    {
        // Arrange
        var identificador = Guid.NewGuid().ToString("N");
        var categoria = new Category($"Integration-{identificador}");
        var cliente = new Customer(
            $"Cliente de integração {identificador}",
            $"customer-{identificador}@example.test",
            identificador[..20],
            identificador[..20]);
        var produto = new Product(
            $"Produto de integração {identificador}",
            "Produto sintético para teste",
            25.00m,
            categoria.Id);
        var localizacao = new Location($"ORD-{identificador}", "Localização de teste");
        var estoque = new Stock(produto.Id, localizacao.Id, 10);

        await using (var contextoInicial = CreateDbContext())
        {
            contextoInicial.Categories.Add(categoria);
            contextoInicial.Customers.Add(cliente);
            contextoInicial.Products.Add(produto);
            contextoInicial.Locations.Add(localizacao);
            contextoInicial.Stocks.Add(estoque);
            await contextoInicial.SaveChangesAsync();
        }

        using var provedor = CreateServiceProvider();
        using var escopo = provedor.CreateScope();
        var casoDeUso = escopo.ServiceProvider.GetRequiredService<CreateOrderUseCase>();

        // Act
        await casoDeUso.ExecuteAsync(new CreateOrderRequest(
            cliente.Id,
            [new CreateOrdemItemRequest(produto.Id, 3)]));

        // Assert
        await using var contextoDeVerificacao = CreateDbContext();
        var pedido = await contextoDeVerificacao.Orders
            .SingleAsync(order => order.CustomerId == cliente.Id);
        var estoqueAtualizado = await contextoDeVerificacao.Stocks
            .SingleAsync(stock => stock.ProductId == produto.Id &&
                                  stock.LocationId == localizacao.Id);

        Assert.Equal(cliente.Id, pedido.CustomerId);
        Assert.Equal(OrderStatus.Pending, pedido.Status);
        Assert.Equal(3, estoqueAtualizado.ReservedQuantity);
    }

    [Fact]
    public async Task Should_Throw_Exception_When_Customer_Is_Inactive()
    {
        // Arrange
        var identificador = Guid.NewGuid().ToString("N");
        var cliente = new Customer(
            $"Cliente inativo {identificador}",
            $"inactive-{identificador}@example.test",
            identificador[..20],
            identificador[..20]);
        cliente.Inactivate();

        await using (var contextoInicial = CreateDbContext())
        {
            contextoInicial.Customers.Add(cliente);
            await contextoInicial.SaveChangesAsync();
        }

        using var provedor = CreateServiceProvider();
        using var escopo = provedor.CreateScope();
        var casoDeUso = escopo.ServiceProvider.GetRequiredService<CreateOrderUseCase>();
        var request = new CreateOrderRequest(
            cliente.Id,
            [new CreateOrdemItemRequest(Guid.NewGuid(), 3)]);

        // Act
        await Assert.ThrowsAsync<ArgumentException>(() => casoDeUso.ExecuteAsync(request));

        // Assert
        await using var contextoDeVerificacao = CreateDbContext();
        var pedidoFoiCriado = await contextoDeVerificacao.Orders
            .AnyAsync(order => order.CustomerId == cliente.Id);

        Assert.False(pedidoFoiCriado);
    }

    private LoxenaDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<LoxenaDbContext>()
            .UseSqlServer(_fixture.ConnectionString)
            .Options;

        return new LoxenaDbContext(options);
    }

    private ServiceProvider CreateServiceProvider()
    {
        var services = new ServiceCollection();
        services.AddDbContext<LoxenaDbContext>(options =>
            options.UseSqlServer(_fixture.ConnectionString));
        services.AddInfrastructure();
        services.AddScoped<CreateOrderUseCase>();

        return services.BuildServiceProvider();
    }
}
