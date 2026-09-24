using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Products.GetProducts;

public class GetProductsUseCase
{
    private readonly IProductRepository _repository;

    public GetProductsUseCase(IProductRepository productRepository)
    {
        _repository = productRepository;
    }

    public async Task<IReadOnlyList<Product>> ExecuteAsync() 
    {
        return await _repository.GetAllAsync();
    }
}
