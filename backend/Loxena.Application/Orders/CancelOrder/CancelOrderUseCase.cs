using Loxena.Application.Interfaces;

namespace Loxena.Application.Orders.CancelOrder;

public class CancelOrderUseCase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IStockRepository _stockRepository;

    public CancelOrderUseCase(
        IOrderRepository orderRepository,
        IStockRepository stockRepository)
    {
        _orderRepository = orderRepository;
        _stockRepository = stockRepository;
    }

    public async Task ExecuteAsync(Guid id) 
    {
        var order = await _orderRepository.GetByIdAsync(id);

        if (order is null)
            throw new InvalidOperationException("O pedido não foi encontrado.");

        foreach (var item in order.Items)
        {
            var stock = await _stockRepository.GetByIdAsync(item.StockId);

            if (stock is null)
                throw new InvalidOperationException(
                    $"O estoque do produto {item.ProductId} não foi encontrado.");

            stock.ReleaseReservedQuantity(item.Quantity);
        }

        order.Cancel();

        await _orderRepository.UpdateAsync(order);
    }
}
