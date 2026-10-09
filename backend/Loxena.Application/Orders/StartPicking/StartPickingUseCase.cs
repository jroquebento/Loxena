using Loxena.Application.Interfaces;

namespace Loxena.Application.Orders.StartPicking;

public class StartPickingUseCase
{
    private readonly IOrderRepository _orderRepository;

    public StartPickingUseCase(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task ExecuteAsync(Guid orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);

        if (order is null)
            throw new InvalidOperationException("O pedido não foi encontrado.");

        order.StartPicking();

        await _orderRepository.UpdateAsync(order);
    }
}
