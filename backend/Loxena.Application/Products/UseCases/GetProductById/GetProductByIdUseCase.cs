using Loxena.Application.Interfaces;
using Loxena.Application.Products.DTOs;
using Loxena.Application.Products.Mappings;
using Loxena.Domain.Entities;

namespace Loxena.Application.Products.UseCases.GetProductById;

public class GetProductByIdUseCase
{
    private readonly IProductRepository _repository;
    public GetProductByIdUseCase(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<ProductResponse?> ExecuteAsync(Guid id) 
    {
        var product = await _repository.GetByIdAsync(id);

        if (product is null)
            return null;

        return product.ToResponse();
    }
}
