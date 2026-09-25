namespace Loxena.Domain.Entities;

public class Stock
{
    public Guid Id { get; private set; }
    public Guid ProductId { get; private set; }
    public Guid LocationId { get; private set; }
    public int PhysicalQuantity { get; private set; }
    public int ReservedQuantity { get; private set; }
    public int AvailableQuantity => PhysicalQuantity - ReservedQuantity;

    private Stock() { }

    public Stock(Guid productId, Guid locationId, int initialQuantity)
    {
        if (productId == Guid.Empty)
            throw new ArgumentException("ProductId is required");
        if (locationId == Guid.Empty)
            throw new ArgumentException("LocationId is required");
        if (initialQuantity < 0)
            throw new ArgumentException("Initial quantity cannot be negative");
        Id = Guid.NewGuid();
        ProductId = productId;
        LocationId = locationId;
        PhysicalQuantity = initialQuantity;
        ReservedQuantity = 0;
    }

    public void AddPhysicalQuantity(int amount)
    {
        ValidatePositiveAmount(amount);
        PhysicalQuantity += amount;
    }

    public void ReserveQuantity(int amount)
    {
        ValidatePositiveAmount(amount);
        if (AvailableQuantity < amount)
            throw new ArgumentException("Insufficient available quantity to reserve.", nameof(amount));
        ReservedQuantity += amount;
    }

    public void ReleaseReservedQuantity(int amount)
    {
        ValidatePositiveAmount(amount);
        if (ReservedQuantity < amount)
            throw new ArgumentException("Insufficient reserved quantity to release.", nameof(amount));
        ReservedQuantity -= amount;
    }
    public void RemovePhysicalQuantity(int amount) 
    {
        ValidatePositiveAmount(amount);
        if (ReservedQuantity < amount)
            throw new InvalidOperationException("Cannot remove physical quantity that exceeds the reserved quantity.");
        PhysicalQuantity -= amount;
        ReservedQuantity -= amount;
    }

    private void ValidatePositiveAmount(int amount)
    {
        if (amount <= 0) 
            throw new ArgumentException("Amount must be a positive number.", nameof(amount));
    }
}
