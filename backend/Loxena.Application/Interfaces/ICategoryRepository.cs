using Loxena.Domain.Entities;

namespace Loxena.Application.Interfaces;

public interface ICategoryRepository
{
    Task AddAsync(Category category);
    Task<Category?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<Category>> GetAllAsync();
    Task UpdateAsync(Category category);
}
