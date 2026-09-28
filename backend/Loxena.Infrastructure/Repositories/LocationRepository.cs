using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Loxena.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Loxena.Infrastructure.Repositories;

internal class LocationRepository : ILocationRepository
{
    private readonly LoxenaDbContext _context;

    public LocationRepository(LoxenaDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Location location)
    {
        _context.Locations.Add(location);
        await _context.SaveChangesAsync();
    }

    public async Task<Location?> GetByIdAsync(Guid id)
    {
        return await _context.Locations.FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<IReadOnlyList<Location>> GetAllAsync()
    {
        return await _context.Locations.ToListAsync();        
    }

    public async Task UpdateAsync(Location location)
    {
        _context.Locations.Update(location);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsByCodeAsync(string code, Guid? excludeId = null)
    {
        var query = _context.Locations
            .Where(l => l.Code.ToUpper() == code.ToUpper() && l.IsActive);

        if (excludeId.HasValue)
        {
            query = query.Where(l => l.Id != excludeId.Value);
        }

        return await query.AnyAsync();
    } 
}
