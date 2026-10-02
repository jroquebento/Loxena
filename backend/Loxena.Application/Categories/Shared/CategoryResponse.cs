namespace Loxena.Application.Categories.Shared;

public record CategoryResponse(
    Guid Id,
    string Name,
    bool IsActive
);
