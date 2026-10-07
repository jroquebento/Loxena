using Loxena.Domain.Entities;

namespace Loxena.Application.Interfaces;

public interface IOrderRepository
{
    Task AddAsync(Order order);
    Task<Order?> GetByIdAsync(Guid id);
    Task UpdateAsync(Order order);
}
