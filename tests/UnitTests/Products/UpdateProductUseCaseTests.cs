using Loxena.Application.Categories.Interfaces;
using Loxena.Application.Products.Interfaces;
using Loxena.Application.Products.UseCases.UpdateProduct;
using Loxena.Domain.Entities;
using Moq;

namespace UnitTests.Products;

public class UpdateProductUseCaseTests
{
    [Fact]
    public async Task Should_Update_Product() 
    {
        var productRepository = new Mock<IProductRepository>();
        var categoryRepository = new Mock<ICategoryRepository>();

        var category = new Category("Eletrônicos");
        var existingProduct = new Product("Teclado Velho", "Antigo", 50.0m, category.Id);

        productRepository
            .Setup(x => x.GetByIdAsync(existingProduct.Id))
            .ReturnsAsync(existingProduct);

        categoryRepository
            .Setup(x => x.GetByIdAsync(category.Id))
            .ReturnsAsync(category);

        var request = new UpdateProductRequest
        {
            Name = "Teclado Mecânico",
            Description = "Teclado mecânico ABNT2",
            Price = 249.90m,
            CategoryId = category.Id
        };

        var useCase = new UpdateProductUseCase(
            categoryRepository.Object,
            productRepository.Object
            );

        var result = await useCase.ExecuteAsync(existingProduct.Id, request);

        Assert.NotNull(result);
        Assert.Equal("Teclado Mecânico", result.Name);
        Assert.Equal("Teclado mecânico ABNT2", result.Description);
        Assert.Equal(249.90m, result.Price);
        Assert.Equal(category.Id, result.CategoryId);

        productRepository.Verify(
            x => x.UpdateAsync(It.IsAny<Product>()),
            Times.Once);
    }
}
