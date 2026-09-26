using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.CreateCategory;

public class CreateCategoryUseCase
{
    private readonly ICategoryRepository _repository;

    public CreateCategoryUseCase(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<Category> ExecuteAsync(CreateCategoryRequest request) 
    {
        var category = new Category(request.Name);
        await _repository.AddAsync(category);

        return category;
    }
}
