using Loxena.Application.Categories.CreateCategory;
using Loxena.Application.Categories.GetCategories;
using Loxena.Application.Categories.GetCategoryById;
using Loxena.Application.Categories.UpdateCategory;
using Loxena.Application.Products.CreateProduct;
using Loxena.Application.Products.GetProductById;
using Loxena.Application.Products.GetProducts;
using Loxena.Application.Products.UpdateProduct;
using Microsoft.Extensions.DependencyInjection;

namespace Loxena.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<CreateCategoryUseCase>();
        services.AddScoped<GetCategoriesUseCase>();
        services.AddScoped<GetCategoryByIdUseCase>();
        services.AddScoped<UpdateCategoryUseCase>();
        services.AddScoped<CreateProductUseCase>();
        services.AddScoped<GetProductsUseCase>();
        services.AddScoped<GetProductByIdUseCase>();
        services.AddScoped<UpdateProductUseCase>();

        return services;
    }
}
