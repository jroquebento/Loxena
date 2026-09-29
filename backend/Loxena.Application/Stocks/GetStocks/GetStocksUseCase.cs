using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Stocks.GetStocks;

public class GetStocksUseCase
{
    private readonly IStockRepository _stockRepository;

    public GetStocksUseCase(IStockRepository stockRepository)
    {
        _stockRepository = stockRepository;
    }

    public async Task<IReadOnlyList<Stock>> ExecuteAsync() 
    {
        return await _stockRepository.GetAllAsync();
    }
}
