using Loxena.Application.Interfaces;

namespace Loxena.Application.Categories.UseCases.InactivateCategory;

public class InactivateCategoryUseCase
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductRepository _productRepository;
    public InactivateCategoryUseCase(
        ICategoryRepository categoryRepository,
        IProductRepository productRepository
        )
    {
        _categoryRepository = categoryRepository;
        _productRepository = productRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id) 
    {
        var hasProducts = await _productRepository.HasActiveProductsByCategoryAsync(id);
        if (hasProducts) 
        {
            throw new InvalidOperationException("Esta categoria possui produtos ativos vinculados.");
        }

        var category = await _categoryRepository.GetByIdAsync(id);

        if (category is null)
            return false;

        if (category.IsActive)
        {
            category.Inactivate();
            await _categoryRepository.UpdateAsync(category);
        }

        return true;
    }
}
