using Loxena.Application.Interfaces;
using Loxena.Domain.Enums;

namespace Loxena.Application.Orders.PickOrderItem;

public class PickOrderItemUseCase
{
    private readonly IOrderRepository _orderRepository;
    public PickOrderItemUseCase(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task ExecuteAsync(Guid orderId, PickOrderItemRequest request) 
    {
        var order = await _orderRepository.GetByIdAsync(orderId);

        if (order is null)
            throw new InvalidOperationException("O pedido não foi encontrado.");

        if (order.Status != OrderStatus.Picking)
            throw new InvalidOperationException("O pedido precisa estar em separação para registrar o picking.");

        var item = order.Items
            .FirstOrDefault(i => i.Id == request.OrderItemId);

        if(item is null)
            throw new InvalidOperationException("O item informado não pertence ao pedido.");

        item.Pick(request.Quantity);

        await _orderRepository.UpdateAsync(order);
    }
}
