using Loxena.Domain.Entities;

namespace Loxena.Application.Products.Shared;

public static class ProductMappers
{
    public static ProductResponse ToResponse(this Product product)
    {
        return new ProductResponse(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.CategoryId,
            product.IsActive
        );
    }
}
