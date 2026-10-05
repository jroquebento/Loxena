using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Mapster;

namespace Loxena.Application.Locations.GetLocations;

public class GetLocationsUseCase
{
    private readonly ILocationRepository _locationRepository;
    public GetLocationsUseCase(ILocationRepository locationRepository)
    {
        _locationRepository = locationRepository;
    }

    public async Task<IReadOnlyList<LocationResponse>> ExecuteAsync() 
    {
        var locations = await _locationRepository.GetAllAsync();

        return locations.Adapt<IReadOnlyList<LocationResponse>>();
    }
}
