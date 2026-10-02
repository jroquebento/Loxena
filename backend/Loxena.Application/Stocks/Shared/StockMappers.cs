using Loxena.Domain.Entities;

namespace Loxena.Application.Stocks.Shared;

public static class StockMappers
{
    public static StockResponse ToResponse(this Stock stock)
    {
        return new StockResponse(
            stock.Id,
            stock.ProductId,
            stock.LocationId,
            stock.PhysicalQuantity,
            stock.ReservedQuantity,
            stock.AvailableQuantity
        );
    }
}
