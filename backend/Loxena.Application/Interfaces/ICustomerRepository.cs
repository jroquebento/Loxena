using Loxena.Domain.Entities;

namespace Loxena.Application.Interfaces;

public interface ICustomerRepository
{
    Task AddAsync(Customer customer);
    Task<Customer?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<Customer>> GetAllAsync();
    Task UpdateAsync(Customer customer);
    Task<bool> ExistsByEmailAsync(string email, Guid? excludeId = null);
    Task<bool> ExistsByDocumentAsync(string document, Guid? excludeId = null);
}
