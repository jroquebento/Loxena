using Loxena.Domain.Entities;

namespace Loxena.Application.Locations;

public static class LocationMappers
{
    public static LocationResponse ToResponse(this Location location) 
    {
        return new LocationResponse(
            location.Id,
            location.Code,
            location.Description,
            location.IsActive
        );
    }
}
