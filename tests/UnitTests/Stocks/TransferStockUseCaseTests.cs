using Loxena.Application.Interfaces;
using Loxena.Application.Stocks.TransferStock;
using Loxena.Domain.Entities;
using Moq;

namespace UnitTests.Stocks;

public class TransferStockUseCaseTests
{
    [Fact]
    public async Task Should_Keep_Updated_Source_Stock_When_Transfer_Reduces_Physical_Quantity_To_Zero()
    {
        var stockRepository = new Mock<IStockRepository>();
        var productRepository = new Mock<IProductRepository>();
        var locationRepository = new Mock<ILocationRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();
        var product = new Product("Produto de teste", "Descrição sintética", 10m, Guid.NewGuid());
        var sourceLocation = new Location("A-01", "Origem de teste");
        var targetLocation = new Location("B-01", "Destino de teste");
        var sourceStock = new Stock(product.Id, sourceLocation.Id, 5);
        var request = new TransferStockRequest
        {
            ProductId = product.Id,
            SourceLocationId = sourceLocation.Id,
            TargetLocationId = targetLocation.Id,
            Amount = 5
        };
        Stock? addedStock = null;

        productRepository
            .Setup(repository => repository.GetByIdAsync(product.Id))
            .ReturnsAsync(product);
        locationRepository
            .Setup(repository => repository.GetByIdAsync(targetLocation.Id))
            .ReturnsAsync(targetLocation);
        stockRepository
            .Setup(repository => repository.HasStockForOtherProductAsync(targetLocation.Id, product.Id))
            .ReturnsAsync(false);
        stockRepository
            .Setup(repository => repository.GetByProductAndLocationAsync(product.Id, sourceLocation.Id))
            .ReturnsAsync(sourceStock);
        stockRepository
            .Setup(repository => repository.GetByProductAndLocationAsync(product.Id, targetLocation.Id))
            .ReturnsAsync((Stock?)null);
        stockRepository
            .Setup(repository => repository.UpdateAsync(It.IsAny<Stock>()))
            .Returns(Task.CompletedTask);
        stockRepository
            .Setup(repository => repository.AddAsync(It.IsAny<Stock>()))
            .Callback<Stock>(stock => addedStock = stock)
            .Returns(Task.CompletedTask);
        unitOfWork
            .Setup(work => work.CommitAsync())
            .Returns(Task.CompletedTask);

        var useCase = new TransferStockUseCase(
            stockRepository.Object,
            productRepository.Object,
            locationRepository.Object,
            unitOfWork.Object);

        await useCase.ExecuteAsync(request);

        Assert.Equal(0, sourceStock.PhysicalQuantity);
        Assert.Equal(0, sourceStock.ReservedQuantity);
        stockRepository.Verify(
            repository => repository.UpdateAsync(It.Is<Stock>(stock =>
                stock.Id == sourceStock.Id && stock.PhysicalQuantity == 0)),
            Times.Once);
        Assert.NotNull(addedStock);
        Assert.Equal(product.Id, addedStock.ProductId);
        Assert.Equal(targetLocation.Id, addedStock.LocationId);
        Assert.Equal(5, addedStock.PhysicalQuantity);
        stockRepository.Verify(repository => repository.AddAsync(It.IsAny<Stock>()), Times.Once);
        unitOfWork.Verify(work => work.CommitAsync(), Times.Once);
    }
}
