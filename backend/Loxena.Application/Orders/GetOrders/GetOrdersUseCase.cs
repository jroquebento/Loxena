using Loxena.Application.Interfaces;
using Mapster;

namespace Loxena.Application.Orders.GetOrders;

public class GetOrdersUseCase
{
    private readonly IOrderRepository _orderRepository;
    public GetOrdersUseCase(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<IReadOnlyList<OrderResponse>> ExecuteAsync() 
    {
        var orders = await _orderRepository.GetAllAsync();

        return orders.Adapt<IReadOnlyList<OrderResponse>>();
    }
}
