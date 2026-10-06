using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Loxena.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Loxena.Infrastructure.Repositories;

internal class CustomerRepository : ICustomerRepository
{
    private readonly LoxenaDbContext _context;

    public CustomerRepository(LoxenaDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
    }

    public async Task<Customer?> GetByIdAsync(Guid id)
    {
        return await _context.Customers.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IReadOnlyList<Customer>> GetAllAsync()
    {
        return await _context.Customers
            .AsNoTracking()
            .Where(c => c.IsActive)
            .ToListAsync();
    }

    public async Task UpdateAsync(Customer customer)
    {
        _context.Customers.Update(customer);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsByDocumentAsync(string document, Guid? excludeId = null)
    {
        return await _context.Customers
            .AnyAsync(c => c.Document == document && c.Id != excludeId);
        
    }

    public async Task<bool> ExistsByEmailAsync(string email, Guid? excludeId = null)
    {
        return await _context.Customers
             .AnyAsync(c => c.Email == email && c.Id != excludeId);
    }
}
