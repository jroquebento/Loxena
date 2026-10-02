using Loxena.Application.Categories.Interfaces;
using Loxena.Application.Categories.Shared;
using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.UseCases.CreateCategory;

public class CreateCategoryUseCase
{
    private readonly ICategoryRepository _repository;

    public CreateCategoryUseCase(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<CategoryResponse> ExecuteAsync(CreateCategoryRequest request) 
    {
        var categoryExists = await _repository.ExistsByNameAsync(request.Name);
        if (categoryExists)
            throw new InvalidOperationException("Já existe uma categoria cadastrada com este nome.");

        var category = new Category(request.Name);
        await _repository.AddAsync(category);

        return category.ToResponse();
    }
}
