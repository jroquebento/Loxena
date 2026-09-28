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

    public async Task<Location?> ExecuteAsync(Guid id) 
    {
        return await _locationRepository.GetByIdAsync(id);
    }
}
