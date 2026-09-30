namespace Loxena.Application.Products.DTOs;

public record ProductResponse(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    Guid CategoryId,
    bool IsActive
);
