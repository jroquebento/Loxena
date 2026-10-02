using Loxena.Application.Categories.Interfaces;
using Loxena.Application.Categories.Shared;
using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.UseCases.GetCategories;

public class GetCategoriesUseCase
{
    private readonly ICategoryRepository _repository;

    public GetCategoriesUseCase(ICategoryRepository repository) 
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CategoryResponse>> ExecuteAsync() 
    {
        var categories = await _repository.GetAllAsync();

        return categories.Select(c => c.ToResponse());
    }
}

