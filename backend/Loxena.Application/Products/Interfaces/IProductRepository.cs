using Loxena.Domain.Entities;

namespace Loxena.Application.Products.Interfaces;

public interface IProductRepository
{
    Task AddAsync(Product product);
    Task<Product?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<Product>> GetAllAsync();
    Task UpdateAsync(Product product);
    Task<bool> HasActiveProductsByCategoryAsync(Guid categoryId);
}