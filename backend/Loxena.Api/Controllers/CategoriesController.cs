using Loxena.Application.Categories.UseCases.CreateCategory;
using Loxena.Application.Categories.UseCases.GetCategories;
using Loxena.Application.Categories.UseCases.GetCategoryById;
using Loxena.Application.Categories.UseCases.InactivateCategory;
using Loxena.Application.Categories.UseCases.UpdateCategory;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly CreateCategoryUseCase _createCategoryUseCase;
    private readonly GetCategoriesUseCase _getCategoriesUseCase;
    private readonly GetCategoryByIdUseCase _getCategoryByIdUseCase;
    private readonly UpdateCategoryUseCase _updateCategoryUseCase;
    private readonly InactivateCategoryUseCase _inactivateCategoryUseCase;

    public CategoriesController(
        CreateCategoryUseCase createCategoryUseCase, 
        GetCategoriesUseCase getCategoriesUseCase,
        GetCategoryByIdUseCase getCategoryByIdUseCase,
        UpdateCategoryUseCase updateCategoryUseCase,
        InactivateCategoryUseCase inactivateCategoryUseCase)
    {
        _createCategoryUseCase = createCategoryUseCase;
        _getCategoriesUseCase = getCategoriesUseCase;
        _getCategoryByIdUseCase = getCategoryByIdUseCase;
        _updateCategoryUseCase = updateCategoryUseCase;
        _inactivateCategoryUseCase = inactivateCategoryUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryRequest request) 
    {
        var category = await _createCategoryUseCase.ExecuteAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _getCategoriesUseCase.ExecuteAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var category = await _getCategoryByIdUseCase.ExecuteAsync(id);

        if (category is null)
            return NotFound();

        return Ok(category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateCategoryRequest request) 
    {
        var category = await _updateCategoryUseCase.ExecuteAsync(id, request);

        if (category is null)
            return NotFound();

        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) 
    {
        var success = await _inactivateCategoryUseCase.ExecuteAsync(id);

        if (!success)
            return NotFound();

        return NoContent();
    }
}
