using Loxena.Application.Interfaces;
using Loxena.Application.Products.UseCases.CreateProduct;
using Loxena.Domain.Entities;

using Moq;

namespace UnitTests.Products;

public class CreateProductUseCaseTests
{
    [Fact]
    public async Task Should_Create_Product()
    {
        var productRepository = new Mock<IProductRepository>();
        var categoryRepository = new Mock<ICategoryRepository>();

        var category = new Category("Eletrônicos");

        categoryRepository
            .Setup(x => x.GetByIdAsync(category.Id))
            .ReturnsAsync(category);

        var request = new CreateProductRequest
        {
            Name = "Teclado Mecânico",
            Description = "Teclado mecânico ABNT2",
            Price = 249.90m,
            CategoryId = category.Id
        };

        var useCase = new CreateProductUseCase(
            productRepository.Object,
            categoryRepository.Object);

        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);
        Assert.Equal("Teclado Mecânico", result.Name);
        Assert.Equal("Teclado mecânico ABNT2", result.Description);
        Assert.Equal(249.90m, result.Price);
        Assert.Equal(category.Id, result.CategoryId);

        productRepository.Verify(
            x => x.AddAsync(It.IsAny<Product>()),
            Times.Once);

        categoryRepository.Verify(
            x => x.GetByIdAsync(category.Id),
            Times.Once);
    }

    [Fact]
    public async Task Should_Not_Create_Product_When_Category_Does_Not_Exist()
    {
        var productRepository = new Mock<IProductRepository>();
        var categoryRepository = new Mock<ICategoryRepository>();

        var categoryId = Guid.NewGuid();

        categoryRepository
            .Setup(x => x.GetByIdAsync(categoryId))
            .ReturnsAsync((Category?)null);

        var request = new CreateProductRequest
        {
            Name = "Teclado Mecânico",
            Description = "Teclado mecânico ABNT2",
            Price = 249.90m,
            CategoryId = categoryId
        };

        var useCase = new CreateProductUseCase(
            productRepository.Object,
            categoryRepository.Object);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => useCase.ExecuteAsync(request));

        Assert.Equal("Categoria inexistente ou inativa.", exception.Message);

        productRepository.Verify(
          x => x.AddAsync(It.IsAny<Product>()),
          Times.Never);
    }
}
