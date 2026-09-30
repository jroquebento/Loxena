using Loxena.Application.Interfaces;
using Loxena.Application.Locations.DTOs;
using Loxena.Application.Locations.Mappings;
using Loxena.Domain.Entities;

namespace Loxena.Application.Locations.GetLocations;

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
