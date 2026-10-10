using Loxena.Application.Interfaces;
using Loxena.Domain.Enums;

namespace Loxena.Application.Orders.DeliverOrder;

public class DeliverOrderUseCase
{
    private readonly IOrderRepository _orderRepository;

    public DeliverOrderUseCase(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task ExecuteAsync(Guid id) 
    {
        var order = await _orderRepository.GetByIdAsync(id);

        if (order is null)
            throw new InvalidOperationException("O pedido não foi encontrado.");

        if (order.Status != OrderStatus.Shipped)
            throw new InvalidOperationException(
                "O pedido precisa estar expedido para ser entregue.");

        order.Deliver();

        await _orderRepository.UpdateAsync(order);
    }
}
