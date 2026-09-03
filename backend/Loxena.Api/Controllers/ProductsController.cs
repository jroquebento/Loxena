using Loxena.Application.Products.CreateProduct;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly CreateProductUseCase _createProductUseCase;

    public ProductsController(CreateProductUseCase createProductUseCase)
    {
        _createProductUseCase = createProductUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductRequest request) 
    {
        var product = await _createProductUseCase.ExecuteAsync(request);

        return Ok(product);
    }
}
