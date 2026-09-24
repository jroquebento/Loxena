using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Products.GetProductById;

public class GetProductByIdUseCase
{
    private readonly IProductRepository _repository;
    public GetProductByIdUseCase(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Product?> ExecuteAsync(Guid id) 
    {
        return await _repository.GetByIdAsync(id);
    }
}
