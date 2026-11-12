using Loxena.Application.Interfaces;
using Loxena.Application.Orders.CreateOrder;
using Loxena.Domain.Entities;
using Moq;

namespace UnitTests.Orders;

public class CreateOrderUseCaseTests
{
    [Fact]
    public async Task Should_Create_Order_And_Reserve_Stock_When_All_Products_Are_Active_And_Available()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var productRepository = new Mock<IProductRepository>();
        var stockRepository = new Mock<IStockRepository>();

        var firstProduct = new Product("Teclado", "Teclado compacto", 100m, Guid.NewGuid());
        var secondProduct = new Product("Mouse", "Mouse sem fio", 50m, Guid.NewGuid());
        var firstStock = new Stock(firstProduct.Id, Guid.NewGuid(), 10);
        var secondStock = new Stock(secondProduct.Id, Guid.NewGuid(), 5);
        var request = new CreateOrderRequest(
            Guid.NewGuid(),
            [
                new CreateOrdemItemRequest(firstProduct.Id, 2),
                new CreateOrdemItemRequest(secondProduct.Id, 3)
            ]);
        Order? savedOrder = null;

        productRepository
            .Setup(repository => repository.GetByIdAsync(firstProduct.Id))
            .ReturnsAsync(firstProduct);
        productRepository
            .Setup(repository => repository.GetByIdAsync(secondProduct.Id))
            .ReturnsAsync(secondProduct);
        stockRepository
            .Setup(repository => repository.GetByProductIdAsync(firstProduct.Id))
            .ReturnsAsync((IReadOnlyList<Stock>)new[] { firstStock });
        stockRepository
            .Setup(repository => repository.GetByProductIdAsync(secondProduct.Id))
            .ReturnsAsync((IReadOnlyList<Stock>)new[] { secondStock });
        orderRepository
            .Setup(repository => repository.AddAsync(It.IsAny<Order>()))
            .Callback<Order>(order => savedOrder = order)
            .Returns(Task.CompletedTask);

        var useCase = new CreateOrderUseCase(
            orderRepository.Object,
            productRepository.Object,
            stockRepository.Object);

        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);
        Assert.Equal(request.CustomerId, result.CustomerId);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(350m, result.TotalAmount);
        Assert.Equal(2, firstStock.ReservedQuantity);
        Assert.Equal(3, secondStock.ReservedQuantity);
        Assert.NotNull(savedOrder);
        Assert.Equal(2, savedOrder.Items.Count);
        orderRepository.Verify(repository => repository.AddAsync(It.IsAny<Order>()), Times.Once);
    }

    [Fact]
    public async Task Should_Reject_Order_When_It_Has_No_Items()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var productRepository = new Mock<IProductRepository>();
        var stockRepository = new Mock<IStockRepository>();
        var request = new CreateOrderRequest(Guid.NewGuid(), []);
        var useCase = new CreateOrderUseCase(
            orderRepository.Object,
            productRepository.Object,
            stockRepository.Object);

        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => useCase.ExecuteAsync(request));

        Assert.Equal("O pedido deve conter pelo menos um item.", exception.Message);
        orderRepository.Verify(repository => repository.AddAsync(It.IsAny<Order>()), Times.Never);
        productRepository.Verify(repository => repository.GetByIdAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task Should_Reject_Order_When_Product_Does_Not_Exist()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var productRepository = new Mock<IProductRepository>();
        var stockRepository = new Mock<IStockRepository>();
        var productId = Guid.NewGuid();
        var request = new CreateOrderRequest(
            Guid.NewGuid(),
            [new CreateOrdemItemRequest(productId, 1)]);
        productRepository
            .Setup(repository => repository.GetByIdAsync(productId))
            .ReturnsAsync((Product?)null);

        var useCase = new CreateOrderUseCase(
            orderRepository.Object,
            productRepository.Object,
            stockRepository.Object);

        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => useCase.ExecuteAsync(request));

        Assert.Contains($"Produto com ID {productId} não encontrado.", exception.Message);
        orderRepository.Verify(repository => repository.AddAsync(It.IsAny<Order>()), Times.Never);
        stockRepository.Verify(repository => repository.GetByProductIdAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task Should_Reject_Order_When_Product_Is_Inactive()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var productRepository = new Mock<IProductRepository>();
        var stockRepository = new Mock<IStockRepository>();
        var product = new Product("Produto inativo", "Descrição", 25m, Guid.NewGuid());
        product.Inactivate();
        var request = new CreateOrderRequest(
            Guid.NewGuid(),
            [new CreateOrdemItemRequest(product.Id, 1)]);
        productRepository
            .Setup(repository => repository.GetByIdAsync(product.Id))
            .ReturnsAsync(product);

        var useCase = new CreateOrderUseCase(
            orderRepository.Object,
            productRepository.Object,
            stockRepository.Object);

        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => useCase.ExecuteAsync(request));

        Assert.Equal("Produto Produto inativo está inativo e não pode ser vendido.", exception.Message);
        orderRepository.Verify(repository => repository.AddAsync(It.IsAny<Order>()), Times.Never);
        stockRepository.Verify(repository => repository.GetByProductIdAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task Should_Reject_Order_When_Product_Has_No_Stock_Records()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var productRepository = new Mock<IProductRepository>();
        var stockRepository = new Mock<IStockRepository>();
        var product = new Product("Produto sem estoque", "Descrição", 25m, Guid.NewGuid());
        var request = new CreateOrderRequest(
            Guid.NewGuid(),
            [new CreateOrdemItemRequest(product.Id, 1)]);
        productRepository
            .Setup(repository => repository.GetByIdAsync(product.Id))
            .ReturnsAsync(product);
        stockRepository
            .Setup(repository => repository.GetByProductIdAsync(product.Id))
            .ReturnsAsync(Array.Empty<Stock>());

        var useCase = new CreateOrderUseCase(
            orderRepository.Object,
            productRepository.Object,
            stockRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(request));

        Assert.Equal("Estoque não configurado para o produto 'Produto sem estoque'.", exception.Message);
        orderRepository.Verify(repository => repository.AddAsync(It.IsAny<Order>()), Times.Never);
    }

    [Fact]
    public async Task Should_Reject_Order_When_Available_Stock_Is_Insufficient()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var productRepository = new Mock<IProductRepository>();
        var stockRepository = new Mock<IStockRepository>();
        var product = new Product("Produto com saldo insuficiente", "Descrição", 25m, Guid.NewGuid());
        var stock = new Stock(product.Id, Guid.NewGuid(), 5);
        stock.ReserveQuantity(4);
        var request = new CreateOrderRequest(
            Guid.NewGuid(),
            [new CreateOrdemItemRequest(product.Id, 2)]);
        productRepository
            .Setup(repository => repository.GetByIdAsync(product.Id))
            .ReturnsAsync(product);
        stockRepository
            .Setup(repository => repository.GetByProductIdAsync(product.Id))
            .ReturnsAsync((IReadOnlyList<Stock>)new[] { stock });

        var useCase = new CreateOrderUseCase(
            orderRepository.Object,
            productRepository.Object,
            stockRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(request));

        Assert.Equal("Estoque não configurado para o produto 'Produto com saldo insuficiente'.", exception.Message);
        Assert.Equal(4, stock.ReservedQuantity);
        orderRepository.Verify(repository => repository.AddAsync(It.IsAny<Order>()), Times.Never);
    }
}
