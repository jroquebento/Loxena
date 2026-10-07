using Loxena.Domain.Enums;

namespace Loxena.Domain.Entities;

public class Order
{
    public Guid Id { get; private set;}
    public Guid CustomerId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public OrderStatus Status { get; private set; }

    private readonly List<OrderItem> _items = [];
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    public Customer Customer { get; private set; } = null!;

    private Order() { }

    public Order(Guid customerId)
    {
        Id = Guid.NewGuid();
        CustomerId = customerId;
        CreatedAt = DateTime.UtcNow;
        Status = OrderStatus.Pending;
    }

    public void AddItem(Guid productId, int quantity, decimal unitPrice)
    {
        var item = new OrderItem(productId, quantity, unitPrice);
        _items.Add(item);
    }

    public decimal TotalAmount => _items.Sum(i => i.CalculateTotal());

    public void Cancel()
    {
        if (Status == OrderStatus.Shipped || Status == OrderStatus.Delivered)
            throw new InvalidOperationException("Não é possível cancelar um pedido que já foi expedido.");
        Status = OrderStatus.Canceled;
    }
}
