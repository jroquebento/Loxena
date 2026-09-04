using Loxena.Application.Products.CreateProduct;
using Loxena.Application.Products.GetProductById;
using Loxena.Application.Products.GetProducts;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly CreateProductUseCase _createProductUseCase;
    private readonly GetProductsUseCase _getProductsUseCase;
    private readonly GetProductByIdUseCase _getProductByIdUseCase;

    public ProductsController(
        CreateProductUseCase createProductUseCase,
        GetProductsUseCase getProductsUseCase,
        GetProductByIdUseCase getProductByIdUseCase)
    {
        _createProductUseCase = createProductUseCase;
        _getProductsUseCase = getProductsUseCase;
        _getProductByIdUseCase = getProductByIdUseCase;
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
}
