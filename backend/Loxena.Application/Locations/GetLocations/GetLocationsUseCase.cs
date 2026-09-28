using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Locations.GetLocations;

public class GetLocationsUseCase
{
    private readonly ILocationRepository _locationRepository;
    public GetLocationsUseCase(ILocationRepository locationRepository)
    {
        _locationRepository = locationRepository;
    }

    public async Task<IReadOnlyList<Location>> ExecuteAsync() 
    {
        return await _locationRepository.GetAllAsync();
    }
}
