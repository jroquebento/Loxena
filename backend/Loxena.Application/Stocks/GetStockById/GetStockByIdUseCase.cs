using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Stocks.GetStockById;

public class GetStockByIdUseCase
{
    private readonly IStockRepository _stockRepository;

	public GetStockByIdUseCase(IStockRepository stockRepository)
	{
		_stockRepository = stockRepository;
	}

	public async Task<StockResponse?> ExecuteAsync(Guid id) 
	{
		var stock = await _stockRepository.GetByIdAsync(id);

		if (stock is null)
			return null;

		return stock.ToResponse();

    }
}
