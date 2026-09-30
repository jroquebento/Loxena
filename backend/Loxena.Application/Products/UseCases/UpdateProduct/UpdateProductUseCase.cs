using Loxena.Application.Interfaces;
using Loxena.Application.Products.DTOs;
using Loxena.Application.Products.Mappings;
using Loxena.Domain.Entities;

namespace Loxena.Application.Products.UseCases.UpdateProduct;

public class UpdateProductUseCase
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductRepository _productRepository;
    public UpdateProductUseCase(
        ICategoryRepository categoryRepository,
        IProductRepository productRepository)
    {
        _categoryRepository = categoryRepository;
        _productRepository = productRepository;
    }

    public async Task<ProductResponse?> ExecuteAsync(Guid id, UpdateProductRequest request)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
            return null;

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);

        if (category is null || !category.IsActive)
            throw new ArgumentException("Categoria inexistente ou inativa.");

        product.Update(
            request.Name,
            request.Description,
            request.Price,
            request.CategoryId);

        await _productRepository.UpdateAsync(product);

        return product.ToResponse();
    }
}
