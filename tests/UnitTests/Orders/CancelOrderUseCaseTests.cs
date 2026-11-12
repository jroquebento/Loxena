using Loxena.Application.Interfaces;
using Loxena.Application.Orders.CancelOrder;
using Loxena.Domain.Entities;
using Loxena.Domain.Enums;
using Moq;

namespace UnitTests.Orders;

public class CancelOrderUseCaseTests
{
    [Fact]
    public async Task Should_Cancel_Order_And_Release_Reserved_Stock_When_Order_Is_Cancelable()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var stockRepository = new Mock<IStockRepository>();
        var productId = Guid.NewGuid();
        var stock = new Stock(productId, Guid.NewGuid(), 10);
        stock.ReserveQuantity(3);
        var order = new Order(Guid.NewGuid());
        order.AddItem(productId, stock.Id, 3, 25m);
        orderRepository
            .Setup(repository => repository.GetByIdAsync(order.Id))
            .ReturnsAsync(order);
        stockRepository
            .Setup(repository => repository.GetByIdAsync(stock.Id))
            .ReturnsAsync(stock);
        orderRepository
            .Setup(repository => repository.UpdateAsync(order))
            .Returns(Task.CompletedTask);

        var useCase = new CancelOrderUseCase(orderRepository.Object, stockRepository.Object);

        await useCase.ExecuteAsync(order.Id);

        Assert.Equal(OrderStatus.Canceled, order.Status);
        Assert.Equal(0, stock.ReservedQuantity);
        Assert.Equal(10, stock.PhysicalQuantity);
        stockRepository.Verify(repository => repository.GetByIdAsync(stock.Id), Times.Once);
        orderRepository.Verify(repository => repository.UpdateAsync(order), Times.Once);
    }

    [Fact]
    public async Task Should_Reject_Cancellation_Without_Releasing_Stock_When_Order_Is_Shipped()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var stockRepository = new Mock<IStockRepository>();
        var (order, stock) = CreateOrderWithStockInStatus(OrderStatus.Shipped);
        orderRepository
            .Setup(repository => repository.GetByIdAsync(order.Id))
            .ReturnsAsync(order);

        var useCase = new CancelOrderUseCase(orderRepository.Object, stockRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(order.Id));

        Assert.Equal("Não é possível cancelar um pedido que já foi expedido.", exception.Message);
        Assert.Equal(OrderStatus.Shipped, order.Status);
        Assert.Equal(2, stock.ReservedQuantity);
        stockRepository.Verify(repository => repository.GetByIdAsync(It.IsAny<Guid>()), Times.Never);
        orderRepository.Verify(repository => repository.UpdateAsync(It.IsAny<Order>()), Times.Never);
    }

    [Fact]
    public async Task Should_Reject_Cancellation_Without_Releasing_Stock_When_Order_Is_Delivered()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var stockRepository = new Mock<IStockRepository>();
        var (order, stock) = CreateOrderWithStockInStatus(OrderStatus.Delivered);
        orderRepository
            .Setup(repository => repository.GetByIdAsync(order.Id))
            .ReturnsAsync(order);

        var useCase = new CancelOrderUseCase(orderRepository.Object, stockRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(order.Id));

        Assert.Equal("Não é possível cancelar um pedido que já foi expedido.", exception.Message);
        Assert.Equal(OrderStatus.Delivered, order.Status);
        Assert.Equal(2, stock.ReservedQuantity);
        stockRepository.Verify(repository => repository.GetByIdAsync(It.IsAny<Guid>()), Times.Never);
        orderRepository.Verify(repository => repository.UpdateAsync(It.IsAny<Order>()), Times.Never);
    }

    private static (Order Order, Stock Stock) CreateOrderWithStockInStatus(OrderStatus status)
    {
        var productId = Guid.NewGuid();
        var stock = new Stock(productId, Guid.NewGuid(), 10);
        stock.ReserveQuantity(2);
        var order = new Order(Guid.NewGuid());
        order.AddItem(productId, stock.Id, 2, 25m);

        if (status is OrderStatus.Shipped or OrderStatus.Delivered)
        {
            order.StartPicking();
            order.Items.Single().Pick(2);
            order.StartChecking();
            order.StartPacking();
            order.Ship();

            if (status == OrderStatus.Delivered)
                order.Deliver();
        }

        return (order, stock);
    }
}
