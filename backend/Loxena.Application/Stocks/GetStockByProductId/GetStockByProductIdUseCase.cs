using Loxena.Application.Interfaces;
using Loxena.Application.Stocks.DTOs;
using Loxena.Application.Stocks.Mappings;
using Loxena.Domain.Entities;

namespace Loxena.Application.Stocks.GetStockByProductId;

public class GetStockByProductIdUseCase
{
    private readonly IStockRepository _stockRepository;

    public GetStockByProductIdUseCase(IStockRepository stockRepository)
    {
        _stockRepository = stockRepository;
    }

    public async Task<IEnumerable<StockResponse>> ExecuteAsync(Guid productId) 
    {
        var productStocks = await _stockRepository.GetByProductIdAsync(productId);

        return productStocks.Select(p => p.ToResponse());
    }
}
