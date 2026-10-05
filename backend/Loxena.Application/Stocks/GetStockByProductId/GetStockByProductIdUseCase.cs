using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Mapster;

namespace Loxena.Application.Stocks.GetStockByProductId;

public class GetStockByProductIdUseCase
{
    private readonly IStockRepository _stockRepository;

    public GetStockByProductIdUseCase(IStockRepository stockRepository)
    {
        _stockRepository = stockRepository;
    }

    public async Task<IReadOnlyList<StockResponse>> ExecuteAsync(Guid productId) 
    {
        var productStocks = await _stockRepository.GetByProductIdAsync(productId);

        return productStocks.Adapt<IReadOnlyList<StockResponse>>();
    }
}
