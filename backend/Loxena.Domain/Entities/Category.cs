namespace Loxena.Domain.Entities;

public class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;
    private Category() { }

    public Category(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required.", nameof(name));

        if (name.Trim().Length > 100)
            throw new ArgumentException("Name cannot exceed 100 characters.", nameof(name));

        Id = Guid.NewGuid();
        Name = name.Trim();
        IsActive = true;
    }

    public void UpdateName(string name) 
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required.", nameof(name));

        if (name.Trim().Length > 100)
            throw new ArgumentException("Name cannot exceed 100 characters.", nameof(name));

        Name = name.Trim();
    }

    public void Inactivate() 
    {
        IsActive = false;
    }
}
