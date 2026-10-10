using Loxena.Application.Orders.CancelOrder;
using Loxena.Application.Orders.CreateOrder;
using Loxena.Application.Orders.DeliverOrder;
using Loxena.Application.Orders.GetOrderById;
using Loxena.Application.Orders.GetOrders;
using Loxena.Application.Orders.PickOrderItem;
using Loxena.Application.Orders.ShipOrder;
using Loxena.Application.Orders.StartChecking;
using Loxena.Application.Orders.StartPacking;
using Loxena.Application.Orders.StartPicking;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly CreateOrderUseCase _createOrderUseCase;
    private readonly GetOrderByIdUseCase _getOrderByIdUseCase;
    private readonly GetOrdersUseCase _getOrdersUseCase;
    private readonly CancelOrderUseCase _cancelOrderUseCase;
    private readonly PickOrderItemUseCase _pickOrderItemUseCase;
    private readonly StartPickingUseCase _startPickingUseCase;
    private readonly StartCheckingUseCase _startCheckingUseCase;
    private readonly StartPackingUseCase _startPackingUseCase;
    private readonly ShipOrderUseCase _shipOrderUseCase;
    private readonly DeliverOrderUseCase _deliverOrderUseCase;

    public OrdersController(
        CreateOrderUseCase createOrderUseCase,
        GetOrderByIdUseCase getOrderByIdUseCase,
        GetOrdersUseCase getOrdersUseCase,
        CancelOrderUseCase cancelOrderUseCase,
        PickOrderItemUseCase pickOrderItemUseCase,
        StartPickingUseCase startPickingUseCase,
        StartCheckingUseCase startCheckingUseCase,
        StartPackingUseCase startPackingUseCase,
        ShipOrderUseCase shipOrderUseCase,
        DeliverOrderUseCase deliverOrderUseCase
        )
    {
        _createOrderUseCase = createOrderUseCase;
        _getOrderByIdUseCase = getOrderByIdUseCase;
        _getOrdersUseCase = getOrdersUseCase;
        _cancelOrderUseCase = cancelOrderUseCase;
        _pickOrderItemUseCase = pickOrderItemUseCase;
        _startPickingUseCase = startPickingUseCase;
        _startCheckingUseCase = startCheckingUseCase;
        _startPackingUseCase = startPackingUseCase;
        _shipOrderUseCase = shipOrderUseCase;
        _deliverOrderUseCase = deliverOrderUseCase;
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

    [HttpGet]
    public async Task<IActionResult> GetAll() 
    {
        var response = await _getOrdersUseCase.ExecuteAsync();
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

    [HttpPatch("{id}/start-packing")]
    public async Task<IActionResult> StartPacking(Guid id) 
    {
        await _startPackingUseCase.ExecuteAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/ship")]
    public async Task<IActionResult> Ship(Guid id) 
    {
        await _shipOrderUseCase.ExecuteAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/deliver")]
    public async Task<IActionResult> Deliver(Guid id) 
    {
        await _deliverOrderUseCase.ExecuteAsync(id);
        return NoContent();
    }
}
