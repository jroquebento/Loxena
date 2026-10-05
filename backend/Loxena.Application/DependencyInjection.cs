using Loxena.Application.Categories.CreateCategory;
using Loxena.Application.Categories.GetCategories;
using Loxena.Application.Categories.GetCategoryById;
using Loxena.Application.Categories.InactivateCategory;
using Loxena.Application.Categories.UpdateCategory;
using Loxena.Application.Locations.CreateLocation;
using Loxena.Application.Locations.GetLocationById;
using Loxena.Application.Locations.GetLocations;
using Loxena.Application.Locations.InactivateLocation;
using Loxena.Application.Locations.UpdateLocation;
using Loxena.Application.Products.CreateProduct;
using Loxena.Application.Products.GetProductById;
using Loxena.Application.Products.GetProducts;
using Loxena.Application.Products.InactivateProduct;
using Loxena.Application.Products.UpdateProduct;
using Loxena.Application.Stocks.AddStock;
using Loxena.Application.Stocks.GetStockById;
using Loxena.Application.Stocks.GetStockByProductId;
using Loxena.Application.Stocks.GetStocks;
using Loxena.Application.Stocks.RemoveStock;
using Loxena.Application.Stocks.TransferStock;
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
