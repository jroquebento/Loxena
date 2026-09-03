using Loxena.Application.Categories.CreateCategory;
using Loxena.Application.Categories.GetCategories;
using Loxena.Application.Categories.GetCategoryById;
using Loxena.Application.Categories.UpdateCategory;
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

    public CategoriesController(
        CreateCategoryUseCase createCategoryUseCase, 
        GetCategoriesUseCase getCategoriesUseCase,
        GetCategoryByIdUseCase getCategoryByIdUseCase,
        UpdateCategoryUseCase updateCategoryUseCase)
    {
        _createCategoryUseCase = createCategoryUseCase;
        _getCategoriesUseCase = getCategoriesUseCase;
        _getCategoryByIdUseCase = getCategoryByIdUseCase;
        _updateCategoryUseCase = updateCategoryUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> Create(string name) 
    {
        var category = await _createCategoryUseCase.ExecuteAsync(name);

        return Ok(category);
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
    public async Task<IActionResult> Update(Guid id, string name) 
    {
        var category = await _updateCategoryUseCase.ExecuteAsync(id, name);

        if (category is null)
            return NotFound();

        return Ok(category);
    }
}
