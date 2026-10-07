using Loxena.Application.Interfaces;
using Mapster;

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
        var order = await _orderRepository.GetByIdAsync(id);
        if (order is null)
            throw new InvalidOperationException("O Pedido não foi encontrado.");

        return order.Adapt<OrderResponse>();
    }
}
