using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Locations.GetLocationById;

public class GetLocationByIdUseCase
{
    private readonly ILocationRepository _locationRepository;

    public GetLocationByIdUseCase(ILocationRepository locationRepository)
    {
        _locationRepository = locationRepository;
    }

    public async Task<LocationResponse?> ExecuteAsync(Guid id) 
    {
        var location = await _locationRepository.GetByIdAsync(id);

        if (location == null)
            return null;

        return location.ToResponse();
    }
}
