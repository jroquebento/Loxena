using Loxena.Application.Products.Interfaces;
using Loxena.Application.Products.Shared;
using Loxena.Domain.Entities;

namespace Loxena.Application.Products.UseCases.GetProducts;

public class GetProductsUseCase
{
    private readonly IProductRepository _repository;

    public GetProductsUseCase(IProductRepository productRepository)
    {
        _repository = productRepository;
    }

    public async Task<IEnumerable<ProductResponse>> ExecuteAsync() 
    {
        var products = await _repository.GetAllAsync();

        return products.Select(p => p.ToResponse());
    }
}
