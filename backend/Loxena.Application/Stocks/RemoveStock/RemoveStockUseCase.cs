using Loxena.Application.Interfaces;
using Mapster;

namespace Loxena.Application.Stocks.RemoveStock;

public class RemoveStockUseCase
{
    private readonly IStockRepository _stockRepository;

    public RemoveStockUseCase(IStockRepository stockRepository)
    {
        _stockRepository = stockRepository;
    }

    public async Task<StockResponse> ExecuteAsync(RemoveStockRequest request) 
    {
        if (request.Amount <= 0)
            throw new ArgumentException("A quantidade a ser removida deve ser maior que zero.");

        var stock = await _stockRepository.GetByProductAndLocationAsync(request.ProductId, request.LocationId);

        if (stock is null)
            throw new InvalidOperationException("Não há estoque registrado para este produto nesta localização.");

        stock.RemovePhysicalQuantity(request.Amount);
        await _stockRepository.UpdateAsync(stock);

        return stock.Adapt<StockResponse>();
    }
}

