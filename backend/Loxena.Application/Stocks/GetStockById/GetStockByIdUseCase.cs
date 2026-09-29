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

	public async Task<Stock?> ExecuteAsync(Guid id) 
	{
		return await _stockRepository.GetByIdAsync(id);
	}
}
