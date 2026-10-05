using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Products.CreateProduct;

public class CreateProductUseCase
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public CreateProductUseCase(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<ProductResponse> ExecuteAsync(CreateProductRequest request) 
    {
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
        
        if (category is null || !category.IsActive)
            throw new InvalidOperationException("Categoria inexistente ou inativa.");

        var product = new Product(
            request.Name,
            request.Description, 
            request.Price, 
            request.CategoryId);

        await _productRepository.AddAsync(product);

        return product.ToResponse();
    }
}
