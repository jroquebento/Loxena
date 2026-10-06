using Loxena.Application.Interfaces;
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
        services.AddScoped<ICustomerRepository, CustomerRepository>();

        return services;
    }
}
