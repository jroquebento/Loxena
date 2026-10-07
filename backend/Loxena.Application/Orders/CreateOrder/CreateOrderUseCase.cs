using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Mapster;

namespace Loxena.Application.Orders.CreateOrder;

public class CreateOrderUseCase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public CreateOrderUseCase(
        IOrderRepository orderRepository,
        IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
    }

    public async Task<CreateOrderResponse> ExecuteAsync(CreateOrderRequest request)
    {
        if (request.Items == null || !request.Items.Any())
            throw new ArgumentException("O pedido deve conter pelo menos um item.");

        var order = new Order(request.CustomerId);

        foreach (var itemRequest in request.Items)
        {
            var product = await _productRepository.GetByIdAsync(itemRequest.ProductId);

            if (product == null)
                throw new ArgumentException($"Produto com ID {itemRequest.ProductId} não encontrado.");

            if(!product.IsActive)
                throw new ArgumentException($"Produto {product.Name} está inativo e não pode ser vendido.");
            order.AddItem(product.Id, itemRequest.Quantity, product.Price);
        }

        await _orderRepository.AddAsync(order);

        return order.Adapt<CreateOrderResponse>();
    }
}
