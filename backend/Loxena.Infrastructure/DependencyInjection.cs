using Loxena.Application.Categories.Interfaces;
using Loxena.Application.Locations.Interfaces;
using Loxena.Application.Products.Interfaces;
using Loxena.Application.Stocks.Interfaces;
using Loxena.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Loxena.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services) 
    {
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ILocationRepository, LocationRepository>();
        services.AddScoped<IStockRepository, StockRepository>();

        return services;
    }
}
