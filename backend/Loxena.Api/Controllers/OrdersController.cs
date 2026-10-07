using Loxena.Application.Orders.CreateOrder;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly CreateOrderUseCase _createOrderUseCase;

    public OrdersController(CreateOrderUseCase createOrderUseCase)
    {
        _createOrderUseCase = createOrderUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderRequest request) 
    {
        var response = await _createOrderUseCase.ExecuteAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id) 
    {
        throw new NotImplementedException();
    }
}
