using Loxena.Application.Interfaces;

namespace Loxena.Application.Orders.StartPacking;

public class StartPackingUseCase
{
    private readonly IOrderRepository _orderRepository;

    public StartPackingUseCase(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task ExecuteAsync(Guid orderId) 
    {
        var order = await _orderRepository.GetByIdAsync(orderId);

        if (order is null)
            throw new InvalidOperationException("O pedido não foi encontrado.");

        order.StartPacking();

        await _orderRepository.UpdateAsync(order);
    }
}
