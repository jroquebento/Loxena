using Loxena.Application.Categories.DTOs;
using Loxena.Application.Categories.Mappings;
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

    public async Task<IEnumerable<CategoryResponse>> ExecuteAsync() 
    {
        var categories = await _repository.GetAllAsync();

        return categories.Select(c => c.ToResponse());
    }
}

