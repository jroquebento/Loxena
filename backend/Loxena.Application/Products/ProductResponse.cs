namespace Loxena.Application.Products;

public record ProductResponse(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    Guid CategoryId,
    bool IsActive
);
