using Loxena.Application.Interfaces;
using Loxena.Application.Stocks.AddStock;
using Loxena.Domain.Entities;
using Moq;

namespace UnitTests.Stocks;

public class AddStockUseCaseTests
{
    [Fact]
    public async Task Should_Add_Stock_And_Commit_When_Product_And_Location_Are_Active()
    {
        var stockRepository = new Mock<IStockRepository>();
        var productRepository = new Mock<IProductRepository>();
        var locationRepository = new Mock<ILocationRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();
        var product = new Product("Produto de teste", "Descrição sintética", 10m, Guid.NewGuid());
        var location = new Location("A-01", "Localização de teste");
        var request = new AddStockRequest
        {
            ProductId = product.Id,
            LocationId = location.Id,
            Amount = 5
        };
        Stock? addedStock = null;

        productRepository
            .Setup(repository => repository.GetByIdAsync(product.Id))
            .ReturnsAsync(product);
        locationRepository
            .Setup(repository => repository.GetByIdAsync(location.Id))
            .ReturnsAsync(location);
        stockRepository
            .Setup(repository => repository.HasStockForOtherProductAsync(location.Id, product.Id))
            .ReturnsAsync(false);
        stockRepository
            .Setup(repository => repository.GetByProductAndLocationAsync(product.Id, location.Id))
            .ReturnsAsync((Stock?)null);
        stockRepository
            .Setup(repository => repository.AddAsync(It.IsAny<Stock>()))
            .Callback<Stock>(stock => addedStock = stock)
            .Returns(Task.CompletedTask);
        unitOfWork
            .Setup(work => work.CommitAsync())
            .Returns(Task.CompletedTask);

        var useCase = new AddStockUseCase(
            stockRepository.Object,
            productRepository.Object,
            locationRepository.Object,
            unitOfWork.Object);

        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(addedStock);
        Assert.Equal(addedStock.Id, result.Id);
        Assert.Equal(product.Id, addedStock.ProductId);
        Assert.Equal(location.Id, addedStock.LocationId);
        Assert.Equal(5, addedStock.PhysicalQuantity);
        stockRepository.Verify(repository => repository.AddAsync(It.IsAny<Stock>()), Times.Once);
        unitOfWork.Verify(work => work.CommitAsync(), Times.Once);
    }
}
