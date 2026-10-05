using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Mapster;

namespace Loxena.Application.Categories.GetCategories;

public class GetCategoriesUseCase
{
    private readonly ICategoryRepository _repository;

    public GetCategoriesUseCase(ICategoryRepository repository) 
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CategoryResponse>> ExecuteAsync() 
    {
        var categories = await _repository.GetAllAsync();

        return categories.Adapt<IReadOnlyList<CategoryResponse>>();
    }
}

