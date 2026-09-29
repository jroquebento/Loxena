using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Loxena.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Loxena.Infrastructure.Repositories;

public class StockRepository : IStockRepository
{
    private readonly LoxenaDbContext _context;

    public StockRepository(LoxenaDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Stock stock)
    {
        _context.Stocks.Add(stock);
        await _context.SaveChangesAsync();
    }
    public async Task<Stock?> GetByIdAsync(Guid id)
    {
        return await _context.Stocks.FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Stock?> GetByProductAndLocationAsync(Guid productId, Guid locationId)
    {
        return await _context.Stocks
            .FirstOrDefaultAsync(s => s.ProductId == productId && s.LocationId == locationId);
    }
    public async Task<IReadOnlyList<Stock>> GetAllAsync()
    {
        return await _context.Stocks.ToListAsync();
    }
    public async Task<IReadOnlyList<Stock>> GetByProductIdAsync(Guid productId)
    {
        return await _context.Stocks
            .Where(s => s.ProductId == productId)
            .ToListAsync();
    }
    public async Task UpdateAsync(Stock stock)
    {
        _context.Stocks.Update(stock);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> HasStockForOtherProductAsync(Guid locationId, Guid currentProductId)
    {
        return await _context.Stocks
            .AnyAsync(s => s.LocationId == locationId
                        && s.ProductId != currentProductId
                        && s.PhysicalQuantity > 0);
    }
}
