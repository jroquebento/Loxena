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

    public Task AddAsync(Stock stock)
    {
        _context.Stocks.Add(stock);
        return Task.CompletedTask;
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
        return await _context.Stocks
            .AsNoTracking()
            .ToListAsync();
    }
    public async Task<IReadOnlyList<Stock>> GetByProductIdAsync(Guid productId)
    {
        return await _context.Stocks
            .Where(s => s.ProductId == productId)
            .ToListAsync();
    }
    public Task UpdateAsync(Stock stock)
    {
        _context.Stocks.Update(stock);
        return Task.CompletedTask;
    }

    public async Task<bool> HasStockForOtherProductAsync(Guid locationId, Guid currentProductId)
    {
        return await _context.Stocks
            .AnyAsync(s => s.LocationId == locationId
                        && s.ProductId != currentProductId);
    }
    public async Task<IReadOnlyList<Stock>> GetByLocationIdAsync(Guid locationId)
    {
        return await _context.Stocks
            .AsNoTracking()
            .Where(s => s.LocationId == locationId)
            .ToListAsync();
    }

    public async Task<bool> HasStockByProductIdAsync(Guid productId)
    {
        return await _context.Stocks.AnyAsync(s => s.ProductId == productId);
    }
}
