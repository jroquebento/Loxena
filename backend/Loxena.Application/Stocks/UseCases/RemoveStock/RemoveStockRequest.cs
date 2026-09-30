namespace Loxena.Application.Stocks.UseCases.RemoveStock;

public class RemoveStockRequest
{
    public Guid ProductId { get; set; }
    public Guid LocationId { get; set; }
    public int Amount { get; set; }
}
