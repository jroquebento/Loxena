using Loxena.Application.Orders.CancelOrder;
using Loxena.Application.Orders.CreateOrder;
using Loxena.Application.Orders.GetOrderById;
using Loxena.Application.Orders.PickOrderItem;
using Loxena.Application.Orders.StartChecking;
using Loxena.Application.Orders.StartPicking;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly CreateOrderUseCase _createOrderUseCase;
    private readonly GetOrderByIdUseCase _getOrderByIdUseCase;
    private readonly CancelOrderUseCase _cancelOrderUseCase;
    private readonly PickOrderItemUseCase _pickOrderItemUseCase;
    private readonly StartPickingUseCase _startPickingUseCase;
    private readonly StartCheckingUseCase _startCheckingUseCase;

    public OrdersController(
        CreateOrderUseCase createOrderUseCase,
        GetOrderByIdUseCase getOrderByIdUseCase,
        CancelOrderUseCase cancelOrderUseCase,
        PickOrderItemUseCase pickOrderItemUseCase,
        StartPickingUseCase startPickingUseCase,
        StartCheckingUseCase startCheckingUseCase)
    {
        _createOrderUseCase = createOrderUseCase;
        _getOrderByIdUseCase = getOrderByIdUseCase;
        _cancelOrderUseCase = cancelOrderUseCase;
        _pickOrderItemUseCase = pickOrderItemUseCase;
        _startPickingUseCase = startPickingUseCase;
        _startCheckingUseCase = startCheckingUseCase;
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

    [HttpPatch("{id}/pick")]
    public async Task<IActionResult> Pick(Guid id, PickOrderItemRequest request) 
    {
        await _pickOrderItemUseCase.ExecuteAsync(id, request);

        return NoContent();
    }

    [HttpPatch("{id}/start-picking")]
    public async Task<IActionResult> StartPicking(Guid id)
    { 
        await _startPickingUseCase.ExecuteAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/start-checking")]
    public async Task<IActionResult> StartChecking(Guid id) 
    {
        await _startCheckingUseCase.ExecuteAsync(id);
        return NoContent();
    }
}
