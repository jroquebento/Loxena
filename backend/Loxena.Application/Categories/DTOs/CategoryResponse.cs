namespace Loxena.Application.Categories.DTOs;

public record CategoryResponse(
    Guid Id,
    string Name,
    bool IsActive
);
