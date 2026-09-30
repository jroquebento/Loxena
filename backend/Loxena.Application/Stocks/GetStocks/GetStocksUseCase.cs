using Loxena.Application.Interfaces;
using Loxena.Application.Stocks.DTOs;
using Loxena.Application.Stocks.Mappings;
using Loxena.Domain.Entities;

namespace Loxena.Application.Stocks.GetStocks;

public class GetStocksUseCase
{
    private readonly IStockRepository _stockRepository;

    public GetStocksUseCase(IStockRepository stockRepository)
    {
        _stockRepository = stockRepository;
    }

    public async Task<IEnumerable<StockResponse>> ExecuteAsync() 
    {
        var stocks = await _stockRepository.GetAllAsync();

        return stocks.Select(s => s.ToResponse());
    }
}
