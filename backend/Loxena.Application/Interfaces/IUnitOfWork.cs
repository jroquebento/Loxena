namespace Loxena.Application.Interfaces;

public interface IUnitOfWork
{
    Task CommitAsync();
}
