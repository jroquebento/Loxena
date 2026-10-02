using Loxena.Application.Locations.Interfaces;
using Loxena.Application.Locations.Shared;
using Loxena.Domain.Entities;

namespace Loxena.Application.Locations.UseCases.GetLocations;

public class GetLocationsUseCase
{
    private readonly ILocationRepository _locationRepository;
    public GetLocationsUseCase(ILocationRepository locationRepository)
    {
        _locationRepository = locationRepository;
    }

    public async Task<IEnumerable<LocationResponse>> ExecuteAsync() 
    {
        var locations = await _locationRepository.GetAllAsync();

        return locations.Select(l => l.ToResponse());
    }
}
