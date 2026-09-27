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
            throw new ArgumentException("ProductId é obrigatório");
        if (locationId == Guid.Empty)
            throw new ArgumentException("LocationId é obrigatório.");
        if (initialQuantity < 0)
            throw new ArgumentException("A quantidade inicial não pode ser negativa.");
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
            throw new ArgumentException("Quantidade disponível insuficiente para reserva.");
        ReservedQuantity += amount;
    }

    public void ReleaseReservedQuantity(int amount)
    {
        ValidatePositiveAmount(amount);
        if (ReservedQuantity < amount)
            throw new ArgumentException("Quantidade reservada insuficiente para liberação.");
        ReservedQuantity -= amount;
    }
    public void RemovePhysicalQuantity(int amount) 
    {
        ValidatePositiveAmount(amount);
        if (ReservedQuantity < amount)
            throw new InvalidOperationException("Não é possível remover uma quantidade física que exceda a quantidade reservada.");
        PhysicalQuantity -= amount;
        ReservedQuantity -= amount;
    }

    private void ValidatePositiveAmount(int amount)
    {
        if (amount <= 0) 
            throw new ArgumentException("O valor deve ser um número positivo.");
    }
}
