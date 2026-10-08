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

    public void AddItem(
        Guid productId, 
        Guid stockId,
        int quantity, 
        decimal unitPrice)
    {
        var item = new OrderItem(productId, stockId, quantity, unitPrice);
        _items.Add(item);
    }

    public decimal TotalAmount => _items.Sum(i => i.CalculateTotal());

    public void StartPicking()
    {
        ChangeStatus(OrderStatus.Pending, OrderStatus.Picking);
    }

    public void StartChecking()
    {
        ChangeStatus(OrderStatus.Picking, OrderStatus.Checking);
    }

    public void StartPacking()
    {
        ChangeStatus(OrderStatus.Checking, OrderStatus.Packing);
    }

    public void Ship()
    {
        ChangeStatus(OrderStatus.Packing, OrderStatus.Shipped);
    }

    public void Deliver()
    {
        ChangeStatus(OrderStatus.Shipped, OrderStatus.Delivered);
    }

    public void Cancel()
    {
        if (Status == OrderStatus.Shipped ||
            Status == OrderStatus.Delivered)
        {
            throw new InvalidOperationException(
                "Não é possível cancelar um pedido que já foi expedido.");
        }

        if (Status == OrderStatus.Canceled)
        {
            throw new InvalidOperationException(
                "O pedido já está cancelado.");
        }

        Status = OrderStatus.Canceled;
    }

    private void ChangeStatus(OrderStatus expectedStatus, OrderStatus newStatus)
    {
        if (Status != expectedStatus)
            throw new InvalidOperationException(
                $"O pedido precisa estar em {expectedStatus} para avançar para {newStatus}.");

        Status = newStatus;
    }
}
