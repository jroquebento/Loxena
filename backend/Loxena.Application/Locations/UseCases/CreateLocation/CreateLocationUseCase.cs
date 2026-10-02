using Loxena.Application.Locations.Interfaces;
using Loxena.Application.Locations.Shared;
using Loxena.Domain.Entities;

namespace Loxena.Application.Locations.UseCases.CreateLocation;

public class CreateLocationUseCase
{
    private readonly ILocationRepository _locationRepository;

    public CreateLocationUseCase(ILocationRepository locationRepository)
    {
        _locationRepository = locationRepository;
    }

    public async Task<LocationResponse> ExecuteAsync(CreateLocationRequest request)
    {
        var codeExists = await _locationRepository.ExistsByCodeAsync(request.Code);

        if (codeExists)
            throw new InvalidOperationException("Já existe uma localização ativa com este código");

        var location = new Location(request.Code, request.Description);

        await _locationRepository.AddAsync(location);

        return location.ToResponse();
    }
}
