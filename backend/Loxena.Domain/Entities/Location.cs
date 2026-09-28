namespace Loxena.Domain.Entities;

public class Location
{
    public Guid Id { get; private set; }
    public string Code { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }

    private Location() { }

    public Location(string code, string? description)
    {
        Validate(code, description);

        Id = Guid.NewGuid();
        Code = code.Trim().ToUpper();
        Description = description?.Trim() ?? string.Empty;
        IsActive = true;
    }

    public void Update(string code, string? description) 
    {
        Validate(code, description);

        Code = code.Trim().ToUpper();
        Description = description?.Trim() ?? string.Empty;
    }

    private static void Validate(string code, string? description) 
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new ArgumentException("O código da localização é obrigatório.");
        if (code.Trim().Length > 50)
            throw new ArgumentException("O código não pode exceder 50 caracteres.");
        if (description?.Trim().Length > 500)
            throw new ArgumentException("A descrição não pode exceder 500 caracteres.");
    }
}
