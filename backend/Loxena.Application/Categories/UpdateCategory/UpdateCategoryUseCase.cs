using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.UpdateCategory;

public class UpdateCategoryUseCase
{
    private readonly ICategoryRepository _repository;

    public UpdateCategoryUseCase(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<Category?> ExecuteAsync(Guid id, UpdateCategoryRequest request) 
    {
        var category = await _repository.GetByIdAsync(id);

        if (category is null)
            return null;

        category.UpdateName(request.Name);
        await _repository.UpdateAsync(category);

        return category;
    }
}
