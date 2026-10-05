using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;

namespace Loxena.Application.Locations.UpdateLocation;

public class UpdateLocationUseCase
{
    private readonly ILocationRepository _locationRepository;

    public UpdateLocationUseCase(ILocationRepository locationRepository)
    {
        _locationRepository = locationRepository;
    }

    public async Task<LocationResponse?> ExecuteAsync(Guid id, UpdateLocationRequest request)
    {
        var location = await _locationRepository.GetByIdAsync(id);
        if (location is null)
            return null;

        var codeExists = await _locationRepository.ExistsByCodeAsync(request.Code, id);
        if (codeExists)
            throw new InvalidOperationException("Já existe outra localização ativa com este código.");

        location.Update(request.Code, request.Description);

        await _locationRepository.UpdateAsync(location);

        return location.ToResponse();
    }
}
