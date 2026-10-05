namespace Loxena.Application.Categories;

public record CategoryResponse(
    Guid Id,
    string Name,
    bool IsActive
);
