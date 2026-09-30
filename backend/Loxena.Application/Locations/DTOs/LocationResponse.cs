namespace Loxena.Application.Locations.DTOs;

public record LocationResponse(
    Guid Id,
    string Code,
    string Description,
    bool IsActive
);
