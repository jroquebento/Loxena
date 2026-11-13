using Loxena.Application.Interfaces;
using Loxena.Application.Orders.PickOrderItem;
using Loxena.Domain.Entities;
using Loxena.Domain.Enums;
using Moq;

namespace UnitTests.Orders;

public class PickOrderItemUseCaseTests
{
    [Fact]
    public async Task Should_Accumulate_Picked_Quantity_When_Picking_Is_Partial_And_Then_Completed()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var order = CreateOrderWithStatus(OrderStatus.Picking);
        var item = order.Items.Single();
        orderRepository
            .Setup(repository => repository.GetByIdAsync(order.Id))
            .ReturnsAsync(order);
        orderRepository
            .Setup(repository => repository.UpdateAsync(order))
            .Returns(Task.CompletedTask);
        var useCase = new PickOrderItemUseCase(orderRepository.Object);

        await useCase.ExecuteAsync(order.Id, new PickOrderItemRequest(item.Id, 2));
        Assert.Equal(2, item.PickedQuantity);

        await useCase.ExecuteAsync(order.Id, new PickOrderItemRequest(item.Id, 3));

        Assert.Equal(5, item.PickedQuantity);
        orderRepository.Verify(repository => repository.UpdateAsync(order), Times.Exactly(2));
    }

    [Fact]
    public async Task Should_Reject_Picking_When_Order_Does_Not_Exist()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var orderId = Guid.NewGuid();
        orderRepository
            .Setup(repository => repository.GetByIdAsync(orderId))
            .ReturnsAsync((Order?)null);
        var useCase = new PickOrderItemUseCase(orderRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(orderId, new PickOrderItemRequest(Guid.NewGuid(), 1)));

        Assert.Equal("O pedido não foi encontrado.", exception.Message);
        orderRepository.Verify(repository => repository.UpdateAsync(It.IsAny<Order>()), Times.Never);
    }

    [Theory]
    [InlineData(OrderStatus.Pending)]
    [InlineData(OrderStatus.Checking)]
    public async Task Should_Reject_Picking_When_Order_Is_Not_In_Picking_Status(OrderStatus status)
    {
        var orderRepository = new Mock<IOrderRepository>();
        var order = CreateOrderWithStatus(status);
        var item = order.Items.Single();
        orderRepository
            .Setup(repository => repository.GetByIdAsync(order.Id))
            .ReturnsAsync(order);
        var useCase = new PickOrderItemUseCase(orderRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(order.Id, new PickOrderItemRequest(item.Id, 1)));

        Assert.Equal("O pedido precisa estar em separação para registrar o picking.", exception.Message);
        orderRepository.Verify(repository => repository.UpdateAsync(It.IsAny<Order>()), Times.Never);
    }

    [Fact]
    public async Task Should_Reject_Picking_When_Item_Does_Not_Belong_To_Order()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var order = CreateOrderWithStatus(OrderStatus.Picking);
        orderRepository
            .Setup(repository => repository.GetByIdAsync(order.Id))
            .ReturnsAsync(order);
        var useCase = new PickOrderItemUseCase(orderRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(order.Id, new PickOrderItemRequest(Guid.NewGuid(), 1)));

        Assert.Equal("O item informado não pertence ao pedido.", exception.Message);
        orderRepository.Verify(repository => repository.UpdateAsync(It.IsAny<Order>()), Times.Never);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task Should_Reject_Picking_When_Quantity_Is_Not_Positive(int quantity)
    {
        var orderRepository = new Mock<IOrderRepository>();
        var order = CreateOrderWithStatus(OrderStatus.Picking);
        var item = order.Items.Single();
        orderRepository
            .Setup(repository => repository.GetByIdAsync(order.Id))
            .ReturnsAsync(order);
        var useCase = new PickOrderItemUseCase(orderRepository.Object);

        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => useCase.ExecuteAsync(order.Id, new PickOrderItemRequest(item.Id, quantity)));

        Assert.Equal("A quantidade a separar deve ser maior que zero.", exception.Message);
        Assert.Equal(0, item.PickedQuantity);
        orderRepository.Verify(repository => repository.UpdateAsync(It.IsAny<Order>()), Times.Never);
    }

    [Fact]
    public async Task Should_Reject_Picking_When_Quantity_Exceeds_Requested_Quantity()
    {
        var orderRepository = new Mock<IOrderRepository>();
        var order = CreateOrderWithStatus(OrderStatus.Picking);
        var item = order.Items.Single();
        item.Pick(4);
        orderRepository
            .Setup(repository => repository.GetByIdAsync(order.Id))
            .ReturnsAsync(order);
        var useCase = new PickOrderItemUseCase(orderRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(order.Id, new PickOrderItemRequest(item.Id, 2)));

        Assert.Equal("A quantidade separada não pode ser maior que a quantidade do item.", exception.Message);
        Assert.Equal(4, item.PickedQuantity);
        orderRepository.Verify(repository => repository.UpdateAsync(It.IsAny<Order>()), Times.Never);
    }

    private static Order CreateOrderWithStatus(OrderStatus status)
    {
        var order = new Order(Guid.NewGuid());
        order.AddItem(Guid.NewGuid(), Guid.NewGuid(), 5, 10m);
        var item = order.Items.Single();

        if (status is OrderStatus.Picking or OrderStatus.Checking)
        {
            order.StartPicking();

            if (status == OrderStatus.Checking)
            {
                item.Pick(item.Quantity);
                order.StartChecking();
            }
        }

        return order;
    }
}
