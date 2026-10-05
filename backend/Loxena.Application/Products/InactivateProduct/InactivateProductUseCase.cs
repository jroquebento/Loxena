using Loxena.Application.Interfaces;

namespace Loxena.Application.Products.InactivateProduct;

public class InactivateProductUseCase
{
    private readonly IProductRepository _productRepository;
    private readonly IStockRepository _stockRepository;

    public InactivateProductUseCase(
        IProductRepository productRepository,
        IStockRepository stockRepository)
    {
        _productRepository = productRepository;
        _stockRepository = stockRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
            return false;

        var hasStock = await _stockRepository.HasStockByProductIdAsync(id);
        if (hasStock)
            throw new InvalidOperationException("Este produto não pode ser inativado pois possui registros vinculados no estoque.");
        
        if (product.IsActive)
        {
            product.Inactivate();
            await _productRepository.UpdateAsync(product);
        }

        return true;
    }
}
