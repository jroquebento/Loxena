using Loxena.Domain.Entities;

namespace Loxena.Application.Interfaces;

public interface IOrderRepository
{
    Task AddAsync(Order order);
    Task<Order?> GetByIdAsync(Guid id);
    Task<Order?> GetByIdForDetailsAsync(Guid id);
    Task<IReadOnlyList<Order>> GetAllAsync();
    Task UpdateAsync(Order order);
}
