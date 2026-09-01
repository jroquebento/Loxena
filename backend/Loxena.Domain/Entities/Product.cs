namespace Loxena.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public Guid CategoryId { get; private set; }
    public bool IsActive { get; private set; }

    private Product() { }

    public Product(string name, string? description, decimal price, Guid categoryId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required.", nameof(name));

        if (name.Trim().Length > 200)
            throw new ArgumentException("Name cannot exceed 200 characters", nameof(name));

        if (description?.Trim().Length > 2000)
            throw new ArgumentException("Description cannot exceed 2000 characters", nameof(description));

        if (price < 0)
            throw new ArgumentException("Price cannot be negative", nameof(price));

        if (categoryId == Guid.Empty)
            throw new ArgumentException("CategoryId is required", nameof(categoryId));

        Id = Guid.NewGuid();
        Name = name.Trim();
        Description = description?.Trim() ?? string.Empty;
        Price = price;
        CategoryId = categoryId;
        IsActive = true;
    }
}
