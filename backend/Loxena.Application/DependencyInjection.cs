using Loxena.Application.Categories.UseCases.CreateCategory;
using Loxena.Application.Categories.UseCases.GetCategories;
using Loxena.Application.Categories.UseCases.GetCategoryById;
using Loxena.Application.Categories.UseCases.InactivateCategory;
using Loxena.Application.Categories.UseCases.UpdateCategory;
using Loxena.Application.Locations.UseCases.CreateLocation;
using Loxena.Application.Locations.UseCases.GetLocationById;
using Loxena.Application.Locations.UseCases.GetLocations;
using Loxena.Application.Locations.UseCases.InactivateLocation;
using Loxena.Application.Locations.UseCases.UpdateLocation;
using Loxena.Application.Products.UseCases.CreateProduct;
using Loxena.Application.Products.UseCases.GetProductById;
using Loxena.Application.Products.UseCases.GetProducts;
using Loxena.Application.Products.UseCases.InactivateProduct;
using Loxena.Application.Products.UseCases.UpdateProduct;
using Loxena.Application.Stocks.UseCases.AddStock;
using Loxena.Application.Stocks.UseCases.GetStockById;
using Loxena.Application.Stocks.UseCases.GetStockByProductId;
using Loxena.Application.Stocks.UseCases.GetStocks;
using Loxena.Application.Stocks.UseCases.RemoveStock;
using Loxena.Application.Stocks.UseCases.TransferStock;
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
        services.AddScoped<InactivateProductUseCase>();
        services.AddScoped<InactivateCategoryUseCase>();
        services.AddScoped<CreateLocationUseCase>();
        services.AddScoped<GetLocationsUseCase>();
        services.AddScoped<GetLocationByIdUseCase>();
        services.AddScoped<UpdateLocationUseCase>();
        services.AddScoped<InactivateLocationUseCase>();
        services.AddScoped<AddStockUseCase>();
        services.AddScoped<RemoveStockUseCase>();
        services.AddScoped<GetStocksUseCase>();
        services.AddScoped<GetStockByIdUseCase>();
        services.AddScoped<GetStockByProductIdUseCase>();
        services.AddScoped<TransferStockUseCase>();

        return services;
    }
}
