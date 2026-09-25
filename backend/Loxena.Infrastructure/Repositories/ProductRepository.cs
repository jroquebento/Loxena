using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Loxena.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Loxena.Infrastructure.Repositories;

internal class ProductRepository : IProductRepository
{
    private readonly LoxenaDbContext _context;
    public ProductRepository(LoxenaDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync()
    {
        return await _context.Products
            .Where(p => p.IsActive)
            .ToListAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }
}
