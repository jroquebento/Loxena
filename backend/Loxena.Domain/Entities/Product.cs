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
        Validate(name, description, price, categoryId);

        Id = Guid.NewGuid();
        Name = name.Trim();
        Description = description?.Trim() ?? string.Empty;
        Price = price;
        CategoryId = categoryId;
        IsActive = true;
    }

    public void Update(string name, string? description, decimal price, Guid categoryId) 
    {
        Validate(name, description, price, categoryId);

        Name = name.Trim();
        Description = description?.Trim() ?? string.Empty;
        Price = price;
        CategoryId = categoryId;
    }

    private static void Validate(
        string name,
        string? description,
        decimal price,
        Guid categoryId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("O nome é obrigatório.");

        if (name.Trim().Length > 200)
            throw new ArgumentException("O nome não pode exceder 200 caracteres.");

        if (description?.Trim().Length > 2000)
            throw new ArgumentException("A descrição não pode exceder 2000 caracteres.");

        if (price < 0)
            throw new ArgumentException("O preço não pode ser negativo.");

        if (categoryId == Guid.Empty)
            throw new ArgumentException("CategoryId é obrigatório");
    }

    public void Inactivate() 
    {
        if (!IsActive)
            throw new InvalidOperationException("O produto já está inativo.");
        IsActive = false;
    }
}
