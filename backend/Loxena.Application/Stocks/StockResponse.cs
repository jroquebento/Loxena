namespace Loxena.Application.Stocks;

public record StockResponse(
    Guid Id,
    Guid ProductId,
    Guid LocationId,
    int PhysicalQuantity,
    int ReservedQuantity,
    int AvailableQuantity
);

