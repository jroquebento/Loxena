using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.GetCategories;

public class GetCategoriesUseCase
{
    private readonly ICategoryRepository _repository;

    public GetCategoriesUseCase(ICategoryRepository repository) 
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<Category>> ExecuteAsync() 
    {
        return await _repository.GetAllAsync();
    }
}

