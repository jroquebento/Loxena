using Loxena.Application.Categories.Interfaces;
using Loxena.Application.Categories.Shared;
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
