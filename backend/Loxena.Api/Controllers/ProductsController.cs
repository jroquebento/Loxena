using Loxena.Application.Products.CreateProduct;
using Loxena.Application.Products.GetProductById;
using Loxena.Application.Products.GetProducts;
using Loxena.Application.Products.InactivateProduct;
using Loxena.Application.Products.UpdateProduct;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly CreateProductUseCase _createProductUseCase;
    private readonly GetProductsUseCase _getProductsUseCase;
    private readonly GetProductByIdUseCase _getProductByIdUseCase;
    private readonly UpdateProductUseCase _updateProductUseCase;
    private readonly InactivateProductUseCase _inactivateProductUseCase;

    public ProductsController(
        CreateProductUseCase createProductUseCase,
        GetProductsUseCase getProductsUseCase,
        GetProductByIdUseCase getProductByIdUseCase,
        UpdateProductUseCase updateProductUseCase,
        InactivateProductUseCase inactivateProductUseCase)
    {
        _createProductUseCase = createProductUseCase;
        _getProductsUseCase = getProductsUseCase;
        _getProductByIdUseCase = getProductByIdUseCase;
        _updateProductUseCase = updateProductUseCase;
        _inactivateProductUseCase = inactivateProductUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductRequest request)
    {
        var product = await _createProductUseCase.ExecuteAsync(request);

        return Ok(product);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _getProductsUseCase.ExecuteAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _getProductByIdUseCase.ExecuteAsync(id);

        if (product is null)
            return NotFound();


        return Ok(product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateProductRequest request)
    {
        var product = await _updateProductUseCase.ExecuteAsync(id, request);

        if (product is null)
            return NotFound();

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) 
    {
        var success = await _inactivateProductUseCase.ExecuteAsync(id);

        if (!success)
            return NotFound();

        return NoContent();
    }
}
