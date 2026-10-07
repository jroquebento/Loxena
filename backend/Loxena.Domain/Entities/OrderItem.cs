namespace Loxena.Domain.Entities;

public class OrderItem
{
    public Guid Id { get; private set; }
    public Guid OrderId { get; private set; }
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }

    public Order Order { get; private set; } = null!;
    public Product Product { get; private set; } = null!;

    private OrderItem() { }

    public OrderItem(Guid productId, int quantity, decimal unitPrice)
    {
        if (quantity <= 0) 
            throw new ArgumentException("A quantidade deve ser maior que zero.");
        if (unitPrice < 0) 
            throw new ArgumentException("O preço não pode ser negativo.");

        Id = Guid.NewGuid();
        ProductId = productId;
        Quantity = quantity;
        UnitPrice = unitPrice;
    }
    public decimal CalculateTotal() => Quantity * UnitPrice;
}
