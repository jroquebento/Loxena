using Loxena.Application.Interfaces;
using Loxena.Application.Stocks.RemoveStock;
using Loxena.Domain.Entities;
using Moq;

namespace UnitTests.Stocks;

public class RemoveStockUseCaseTests
{
    [Fact]
    public async Task Should_Keep_Stock_Record_When_Removal_Reduces_Physical_Quantity_To_Zero()
    {
        var stockRepository = new Mock<IStockRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();
        var stock = new Stock(Guid.NewGuid(), Guid.NewGuid(), 5);
        var request = new RemoveStockRequest
        {
            ProductId = stock.ProductId,
            LocationId = stock.LocationId,
            Amount = 5
        };
        stockRepository
            .Setup(repository => repository.GetByProductAndLocationAsync(stock.ProductId, stock.LocationId))
            .ReturnsAsync(stock);
        stockRepository
            .Setup(repository => repository.UpdateAsync(stock))
            .Returns(Task.CompletedTask);
        unitOfWork
            .Setup(work => work.CommitAsync())
            .Returns(Task.CompletedTask);

        var useCase = new RemoveStockUseCase(stockRepository.Object, unitOfWork.Object);

        var result = await useCase.ExecuteAsync(request);

        Assert.Equal(stock.Id, result.Id);
        Assert.Equal(0, result.PhysicalQuantity);
        Assert.Equal(0, result.ReservedQuantity);
        stockRepository.Verify(repository => repository.UpdateAsync(stock), Times.Once);
        unitOfWork.Verify(work => work.CommitAsync(), Times.Once);
    }
}
