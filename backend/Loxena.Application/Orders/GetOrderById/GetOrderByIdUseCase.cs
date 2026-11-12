using Loxena.Application.Interfaces;

namespace Loxena.Application.Orders.GetOrderById;

public class GetOrderByIdUseCase
{
    private readonly IOrderRepository _orderRepository;

    public GetOrderByIdUseCase(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderResponse?> ExecuteAsync(Guid id) 
    {
        var order = await _orderRepository.GetByIdForDetailsAsync(id);
        if (order is null)
            throw new InvalidOperationException("O Pedido não foi encontrado.");

        var items = order.Items
            .Select(item => new OrderItemResponse(
                item.Id,
                item.ProductId,
                item.Quantity,
                item.PickedQuantity,
                item.UnitPrice,
                item.Product.Name))
            .ToList();

        return new OrderResponse(
            order.Id,
            order.CustomerId,
            order.CreatedAt,
            order.Status.ToString(),
            order.TotalAmount,
            items);
    }
}
