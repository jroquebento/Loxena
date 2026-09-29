namespace Loxena.Application.Stocks.AddStock;

public class AddStockRequest
{
    public Guid ProductId { get; set; }
    public Guid LocationId { get; set; }
    public int Amount { get; set; }
}
