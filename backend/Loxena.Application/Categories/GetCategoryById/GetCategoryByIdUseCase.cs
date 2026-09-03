using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.GetCategoryById;

public class GetCategoryByIdUseCase
{
    private readonly ICategoryRepository _repository;
    public GetCategoryByIdUseCase(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<Category?> ExecuteAsync(Guid id) 
    {
        return await _repository.GetByIdAsync(id);
    }
}
