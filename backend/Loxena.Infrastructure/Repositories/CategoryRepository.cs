using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Loxena.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Loxena.Infrastructure.Repositories;

internal class CategoryRepository : ICategoryRepository
{
    private readonly LoxenaDbContext _context;

    public CategoryRepository(LoxenaDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IReadOnlyList<Category>> GetAllAsync()
    {
        return await _context.Categories
            .Where(c => c.IsActive)
            .ToListAsync();
    }

    public async Task UpdateAsync(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }
}
