using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Stocks.UseCases.TransferStock;

public class TransferStockUseCase
{
    private readonly IStockRepository _stockRepository;
    private readonly IProductRepository _productRepository;
    private readonly ILocationRepository _locationRepository;

    public TransferStockUseCase(
        IStockRepository stockRepository,
        IProductRepository productRepository,
        ILocationRepository locationRepository)
    {
        _stockRepository = stockRepository;
        _productRepository = productRepository;
        _locationRepository = locationRepository;
    }

    public async Task ExecuteAsync(TransferStockRequest request)
    {
        if (request.Amount <= 0)
            throw new ArgumentException("A quantidade a ser transferida deve ser maior que zero.");

        if (request.SourceLocationId == request.TargetLocationId)
            throw new ArgumentException("As localizações de origem e destino devem ser diferentes.");

        var product = await _productRepository.GetByIdAsync(request.ProductId);
        if (product is null || !product.IsActive)
            throw new ArgumentException("Produto inválido ou inativo.");

        var targetLocation = await _locationRepository.GetByIdAsync(request.TargetLocationId);
        if (targetLocation is null || !targetLocation.IsActive)
            throw new ArgumentException("Localização de destino inválida ou inativa.");

        var targetOccupied = await _stockRepository.HasStockForOtherProductAsync(request.TargetLocationId, request.ProductId);
        if (targetOccupied)
            throw new InvalidOperationException("A localização de destino já está ocupada por outro produto.");

        var sourceStock = await _stockRepository.GetByProductAndLocationAsync(request.ProductId, request.SourceLocationId);
        if (sourceStock is null)
            throw new InvalidOperationException("Não há estoque na localização de origem para este produto.");

        sourceStock.RemovePhysicalQuantity(request.Amount);

        var targetStock = await _stockRepository.GetByProductAndLocationAsync(request.ProductId, request.TargetLocationId);

        if (sourceStock.PhysicalQuantity == 0 && sourceStock.ReservedQuantity == 0)
        {
            await _stockRepository.DeleteAsync(sourceStock);
        }
        else
        {
            await _stockRepository.UpdateAsync(sourceStock);
        }

        if (targetStock is null)
        {
            targetStock = new Stock(request.ProductId, request.TargetLocationId, request.Amount);
            await _stockRepository.AddAsync(targetStock);
        }
        else
        {
            targetStock.AddPhysicalQuantity(request.Amount);
            await _stockRepository.UpdateAsync(targetStock);
        }
    }
}
