using Loxena.Application.Interfaces;
using Loxena.Domain.Enums;

namespace Loxena.Application.Orders.ShipOrder;

public class ShipOrderUseCase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IStockRepository _stockRepository;

    public ShipOrderUseCase(
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

        if (order.Status != OrderStatus.Packing)
            throw new InvalidOperationException(
                "O pedido precisa estar em embalagem para ser expedido.");

        foreach (var item in order.Items)
        {
            var stock = await _stockRepository.GetByIdAsync(item.StockId);
            if (stock is null)
                throw new InvalidOperationException(
                  $"O estoque do produto {item.ProductId} não foi encontrado.");

            stock.FulfillReservation(item.Quantity);
        }

        order.Ship();

        await _orderRepository.UpdateAsync(order);
    }
}
