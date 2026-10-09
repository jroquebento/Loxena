using Loxena.Application.Interfaces;

namespace Loxena.Application.Orders.StartChecking;

public class StartCheckingUseCase
{
    private readonly IOrderRepository _orderRepository;

    public StartCheckingUseCase(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task ExecuteAsync(Guid orderId) 
    {
        var order = await _orderRepository.GetByIdAsync(orderId);

        if (order is null)
            throw new InvalidOperationException("O pedido não foi encontrado.");

        order.StartChecking();

        await _orderRepository.UpdateAsync(order);
    }
}
