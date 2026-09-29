using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Stocks.GetStockByProductId;

public class GetStockByProductIdUseCase
{
    private readonly IStockRepository _stockRepository;

    public GetStockByProductIdUseCase(IStockRepository stockRepository)
    {
        _stockRepository = stockRepository;
    }

    public async Task<IReadOnlyList<Stock>> ExecuteAsync(Guid productId) 
    {
        return await _stockRepository.GetByProductIdAsync(productId);
    }
}
