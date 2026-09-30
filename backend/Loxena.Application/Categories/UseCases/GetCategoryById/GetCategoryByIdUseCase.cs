using Loxena.Application.Categories.DTOs;
using Loxena.Application.Categories.Mappings;
using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.UseCases.GetCategoryById;

public class GetCategoryByIdUseCase
{
    private readonly ICategoryRepository _repository;
    public GetCategoryByIdUseCase(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<CategoryResponse?> ExecuteAsync(Guid id) 
    {
        var category = await _repository.GetByIdAsync(id);
        if (category == null)
            return null;

        return category.ToResponse();
    }
}
