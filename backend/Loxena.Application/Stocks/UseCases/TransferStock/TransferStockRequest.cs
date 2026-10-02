namespace Loxena.Application.Stocks.UseCases.TransferStock;

public class TransferStockRequest
{
    public Guid ProductId { get; set; }
    public Guid SourceLocationId { get; set; }
    public Guid TargetLocationId { get; set; }
    public int Amount { get; set; }
}
