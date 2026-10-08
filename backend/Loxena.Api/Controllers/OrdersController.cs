using Loxena.Application.Orders.CancelOrder;
using Loxena.Application.Orders.CreateOrder;
using Loxena.Application.Orders.GetOrderById;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly CreateOrderUseCase _createOrderUseCase;
    private readonly GetOrderByIdUseCase _getOrderByIdUseCase;
    private readonly CancelOrderUseCase _cancelOrderUseCase;

    public OrdersController(
        CreateOrderUseCase createOrderUseCase,
        GetOrderByIdUseCase getOrderByIdUseCase,
        CancelOrderUseCase cancelOrderUseCase)
    {
        _createOrderUseCase = createOrderUseCase;
        _getOrderByIdUseCase = getOrderByIdUseCase;
        _cancelOrderUseCase = cancelOrderUseCase;
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
        var response = await _getOrderByIdUseCase.ExecuteAsync(id);

        return Ok(response);
    }

    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id) 
    {
        await _cancelOrderUseCase.ExecuteAsync(id);
        return NoContent();
    }
}
