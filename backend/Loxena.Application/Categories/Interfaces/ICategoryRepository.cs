using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.Interfaces;

public interface ICategoryRepository
{
    Task AddAsync(Category category);
    Task<Category?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<Category>> GetAllAsync();
    Task UpdateAsync(Category category);
    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null);
}
