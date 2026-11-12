using Loxena.Application.Interfaces;

namespace Loxena.Application.Orders.GetOrders;

public class GetOrdersUseCase
{
    private readonly IOrderRepository _orderRepository;
    public GetOrdersUseCase(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<IReadOnlyList<OrderSummaryResponse>> ExecuteAsync() 
    {
        var orders = await _orderRepository.GetAllAsync();

        return orders
            .Select(order => new OrderSummaryResponse(
                order.Id,
                order.CustomerId,
                order.Customer.Name,
                order.CreatedAt,
                order.Status.ToString(),
                order.TotalAmount,
                order.Items.Count))
            .ToList();
    }
}
