namespace Loxena.Application.Products.Shared;

public record ProductResponse(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    Guid CategoryId,
    bool IsActive
);
