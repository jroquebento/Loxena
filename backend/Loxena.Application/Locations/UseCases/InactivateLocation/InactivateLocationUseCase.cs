using Loxena.Application.Interfaces;

namespace Loxena.Application.Locations.UseCases.InactivateLocation;

public class InactivateLocationUseCase
{
    private readonly ILocationRepository _locationRepository;
    private readonly IStockRepository _stockRepository;

    public InactivateLocationUseCase(
        ILocationRepository locationRepository,
        IStockRepository stockRepository)
    {
        _locationRepository = locationRepository;
        _stockRepository = stockRepository;
    }

    public async Task ExecuteAsync(Guid locationId)
    {
        var location = await _locationRepository.GetByIdAsync(locationId);
        if (location is null)
            throw new InvalidOperationException("Localização não encontrada.");

        var stocksInLocation = await _stockRepository.GetByLocationIdAsync(locationId);
        bool hasPhysicalStock = stocksInLocation.Any(s => s.PhysicalQuantity > 0);

        if (hasPhysicalStock)
            throw new InvalidOperationException("Não é possível inativar uma localização que possui produtos em estoque físico.");

        location.Inactivate();

        await _locationRepository.UpdateAsync(location);
    }
}
