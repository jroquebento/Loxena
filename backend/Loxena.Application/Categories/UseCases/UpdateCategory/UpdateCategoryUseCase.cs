using Loxena.Application.Categories.DTOs;
using Loxena.Application.Categories.Mappings;
using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.UseCases.UpdateCategory;

public class UpdateCategoryUseCase
{
    private readonly ICategoryRepository _repository;

    public UpdateCategoryUseCase(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<CategoryResponse?> ExecuteAsync(Guid id, UpdateCategoryRequest request) 
    {
        var category = await _repository.GetByIdAsync(id);
        if (category is null)
            return null;

        var nameExists = await _repository.ExistsByNameAsync(request.Name, id);
        if (nameExists)
            throw new InvalidOperationException("Já existe outra categoria cadastrada com este nome.");

        category.UpdateName(request.Name);
        await _repository.UpdateAsync(category);

        return category.ToResponse();
    }
}
