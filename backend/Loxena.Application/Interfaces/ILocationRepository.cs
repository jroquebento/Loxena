using Loxena.Domain.Entities;

namespace Loxena.Application.Interfaces;

public interface ILocationRepository
{
    Task AddAsync(Location location);
    Task<Location?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<Location>> GetAllAsync();
    Task UpdateAsync(Location location);
    Task<bool> ExistsByCodeAsync(string code, Guid? excludeId = null);
}

