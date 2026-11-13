using Loxena.Application.Interfaces;
using Loxena.Infrastructure.Data;

namespace Loxena.Infrastructure;

public class UnitOfWork : IUnitOfWork
{
    private readonly LoxenaDbContext _context;

    public UnitOfWork(LoxenaDbContext context)
    {
        _context = context;
    }

    public Task CommitAsync()
    {
        return _context.SaveChangesAsync();
    }
}
