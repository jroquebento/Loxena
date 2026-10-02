using Loxena.Application.Locations.Interfaces;
using Loxena.Application.Locations.Shared;
using Loxena.Domain.Entities;

namespace Loxena.Application.Locations.UseCases.GetLocationById;

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
