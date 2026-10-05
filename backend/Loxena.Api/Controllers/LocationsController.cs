using Loxena.Application.Categories.UseCases.InactivateCategory;
using Loxena.Application.Locations.CreateLocation;
using Loxena.Application.Locations.GetLocationById;
using Loxena.Application.Locations.GetLocations;
using Loxena.Application.Locations.InactivateLocation;
using Loxena.Application.Locations.UpdateLocation;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class LocationsController : ControllerBase
{
    private readonly CreateLocationUseCase _createLocationUseCase;
    private readonly GetLocationsUseCase _getLocationsUseCase;
    private readonly GetLocationByIdUseCase _getLocationByIdUseCase;
    private readonly UpdateLocationUseCase _updateLocationUseCase;

    private readonly InactivateLocationUseCase _inactivateLocationUseCase;

    public LocationsController(
        CreateLocationUseCase createLocationUseCase,
        GetLocationsUseCase getLocationsUseCase,
        GetLocationByIdUseCase getLocationByIdUseCase,
        UpdateLocationUseCase updateLocationUseCase,
        InactivateLocationUseCase inactivateLocationUseCase)
    {
        _createLocationUseCase = createLocationUseCase;
        _getLocationsUseCase = getLocationsUseCase;
        _getLocationByIdUseCase = getLocationByIdUseCase;
        _updateLocationUseCase = updateLocationUseCase;
        _inactivateLocationUseCase = inactivateLocationUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateLocationRequest request) 
    {
        var location = await _createLocationUseCase.ExecuteAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = location.Id }, location);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() 
    {
        var locations = await _getLocationsUseCase.ExecuteAsync();
        return Ok(locations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id) 
    {
        var location = await _getLocationByIdUseCase.ExecuteAsync(id);

        if (location is null)
            return NotFound();

        return Ok(location);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateLocationRequest request)
    {
        var location = await _updateLocationUseCase.ExecuteAsync(id, request);

        if (location is null)
            return NotFound();

        return Ok(location);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Inactivate(Guid id) 
    {
        await _inactivateLocationUseCase.ExecuteAsync(id);

        return NoContent();
    }
}
