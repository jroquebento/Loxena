namespace Loxena.Application.Locations.Shared;

public record LocationResponse(
    Guid Id,
    string Code,
    string Description,
    bool IsActive
);
