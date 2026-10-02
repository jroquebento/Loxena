using Loxena.Domain.Entities;

namespace Loxena.Application.Categories.Shared;

public static class CategoryMappers
{
    public static CategoryResponse ToResponse(this Category category)
    {
        return new CategoryResponse(
            category.Id,
            category.Name,
            category.IsActive
        );
    }
}

