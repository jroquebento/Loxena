using Loxena.Application.Customers.InactivateCustomer;
using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Moq;

namespace UnitTests.Customers;

public class InactivateCustomerUseCaseTests
{
    [Fact]
    public async Task Should_Inactivate_And_Update_Customer_When_No_Active_Orders_Exist()
    {
        var customerRepository = new Mock<ICustomerRepository>();
        var orderRepository = new Mock<IOrderRepository>();
        var customer = new Customer("Cliente de teste", "cliente@example.test", "00000000000", "00000000000");

        customerRepository
            .Setup(repository => repository.GetByIdAsync(customer.Id))
            .ReturnsAsync(customer);
        orderRepository
            .Setup(repository => repository.HasActiveOrdersByCustomerIdAsync(customer.Id))
            .ReturnsAsync(false);
        customerRepository
            .Setup(repository => repository.UpdateAsync(customer))
            .Returns(Task.CompletedTask);
        var useCase = new InactivateCustomerUseCase(customerRepository.Object, orderRepository.Object);

        var result = await useCase.ExecuteAsync(customer.Id);

        Assert.True(result);
        Assert.False(customer.IsActive);
        customerRepository.Verify(repository => repository.UpdateAsync(customer), Times.Once);
        orderRepository.Verify(repository => repository.HasActiveOrdersByCustomerIdAsync(customer.Id), Times.Once);
    }

    [Fact]
    public async Task Should_Throw_And_Not_Update_Customer_When_Active_Orders_Exist()
    {
        var customerRepository = new Mock<ICustomerRepository>();
        var orderRepository = new Mock<IOrderRepository>();
        var customer = new Customer("Cliente de teste", "cliente@example.test", "00000000000", "00000000000");

        customerRepository
            .Setup(repository => repository.GetByIdAsync(customer.Id))
            .ReturnsAsync(customer);
        orderRepository
            .Setup(repository => repository.HasActiveOrdersByCustomerIdAsync(customer.Id))
            .ReturnsAsync(true);
        var useCase = new InactivateCustomerUseCase(customerRepository.Object, orderRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(customer.Id));

        Assert.Equal("Não é possível inativar um cliente que possui pedidos ativos.", exception.Message);
        Assert.True(customer.IsActive);
        customerRepository.Verify(repository => repository.UpdateAsync(It.IsAny<Customer>()), Times.Never);
        orderRepository.Verify(repository => repository.HasActiveOrdersByCustomerIdAsync(customer.Id), Times.Once);
    }
}
