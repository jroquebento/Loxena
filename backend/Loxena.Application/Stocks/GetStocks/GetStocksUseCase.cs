using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Mapster;

namespace Loxena.Application.Stocks.GetStocks;

public class GetStocksUseCase
{
    private readonly IStockRepository _stockRepository;

    public GetStocksUseCase(IStockRepository stockRepository)
    {
        _stockRepository = stockRepository;
    }

    public async Task<IReadOnlyList<StockResponse>> ExecuteAsync() 
    {
        var stocks = await _stockRepository.GetAllAsync();

        return stocks.Adapt<IReadOnlyList<StockResponse>>();
    }
}
