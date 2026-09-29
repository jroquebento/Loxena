using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Stocks.AddStock;

public class AddStockUseCase
{
    private readonly IStockRepository _stockRepository;
    private readonly IProductRepository _productRepository;
    private readonly ILocationRepository _locationRepository;

    public AddStockUseCase(
        IStockRepository stockRepository, 
        IProductRepository productRepository, 
        ILocationRepository locationRepository)
    {
        _stockRepository = stockRepository;
        _productRepository = productRepository;
        _locationRepository = locationRepository;
    }

    public async Task<Stock> ExecuteAsync(AddStockRequest request) 
    {
        if (request.Amount <= 0) 
        {
            throw new ArgumentException("A quantidade a ser adicionada deve ser maior que zero.");
        }

        var product = await _productRepository.GetByIdAsync(request.ProductId);
        if (product is null || !product.IsActive)
            throw new ArgumentException("Produto inválido ou inativo.");

        var location = await _locationRepository.GetByIdAsync(request.LocationId);
        if (location is null || !location.IsActive)
            throw new ArgumentException("Localização inválida ou inativa.");

        var locationOccupied = await _stockRepository.HasStockForOtherProductAsync(request.LocationId, request.ProductId);
        if (locationOccupied)
            throw new InvalidOperationException("Esta localização já está ocupada por outro produto.");

        var stock = await _stockRepository.GetByProductAndLocationAsync(request.ProductId, request.LocationId);

        if (stock is null)
        {
            stock = new Stock(request.ProductId, request.LocationId, request.Amount);
            await _stockRepository.AddAsync(stock);
        }
        else 
        {
            stock.AddPhysicalQuantity(request.Amount);
            await _stockRepository.UpdateAsync(stock);
        }

        return stock;
    }
}
