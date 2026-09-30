using Loxena.Application.Interfaces;

namespace Loxena.Application.Products.UseCases.InactivateProduct;

public class InactivateProductUseCase
{
    private readonly IProductRepository _productRepository;

    public InactivateProductUseCase(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
            return false;

        if (product.IsActive)
        {
            product.Inactivate();
            await _productRepository.UpdateAsync(product);
        }

        return true;
    }
}
