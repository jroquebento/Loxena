using Loxena.Domain.Entities;

namespace Loxena.Application.Interfaces;

public interface IStockRepository
{
    Task AddAsync(Stock stock);
    Task<Stock?> GetByIdAsync(Guid id);
    Task<Stock?> GetByProductAndLocationAsync(Guid productId, Guid locationId);
    Task<IReadOnlyList<Stock>> GetAllAsync();
    Task<IReadOnlyList<Stock>> GetByProductIdAsync(Guid productId);
    Task UpdateAsync(Stock stock);
    Task<bool> HasStockForOtherProductAsync(Guid locationId, Guid currentProductId);
}
