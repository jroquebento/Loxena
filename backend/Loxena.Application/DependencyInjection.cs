using Loxena.Application.Categories.CreateCategory;
using Loxena.Application.Categories.GetCategories;
using Loxena.Application.Categories.GetCategoryById;
using Loxena.Application.Categories.InactivateCategory;
using Loxena.Application.Categories.UpdateCategory;
using Loxena.Application.Customers.CreateCustomer;
using Loxena.Application.Customers.GetCustomerById;
using Loxena.Application.Customers.GetCustomers;
using Loxena.Application.Customers.InactivateCustomer;
using Loxena.Application.Customers.UpdateCustomer;
using Loxena.Application.Locations.CreateLocation;
using Loxena.Application.Locations.GetLocationById;
using Loxena.Application.Locations.GetLocations;
using Loxena.Application.Locations.InactivateLocation;
using Loxena.Application.Locations.UpdateLocation;
using Loxena.Application.Orders.CancelOrder;
using Loxena.Application.Orders.CreateOrder;
using Loxena.Application.Orders.GetOrderById;
using Loxena.Application.Orders.PickOrderItem;
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
        services.AddScoped<InactivateCategoryUseCase>();
        services.AddScoped<UpdateCategoryUseCase>();
      
        services.AddScoped<CreateProductUseCase>();
        services.AddScoped<GetProductByIdUseCase>();
        services.AddScoped<GetProductsUseCase>();
        services.AddScoped<InactivateProductUseCase>();
        services.AddScoped<UpdateProductUseCase>();

        services.AddScoped<CreateLocationUseCase>();
        services.AddScoped<GetLocationByIdUseCase>();
        services.AddScoped<GetLocationsUseCase>();
        services.AddScoped<InactivateLocationUseCase>();
        services.AddScoped<UpdateLocationUseCase>();
     
        services.AddScoped<AddStockUseCase>();
        services.AddScoped<GetStockByIdUseCase>();
        services.AddScoped<GetStockByProductIdUseCase>();
        services.AddScoped<GetStocksUseCase>();
        services.AddScoped<RemoveStockUseCase>();
        services.AddScoped<TransferStockUseCase>();

        services.AddScoped<CreateCustomerUseCase>();
        services.AddScoped<GetCustomerByIdUseCase>();
        services.AddScoped<GetCustomersUseCase>();
        services.AddScoped<InactivateCustomerUseCase>();
        services.AddScoped<UpdateCustomerUseCase>();
      
        services.AddScoped<CreateOrderUseCase>();
        services.AddScoped<GetOrderByIdUseCase>();
        services.AddScoped<CancelOrderUseCase>();
        services.AddScoped<PickOrderItemUseCase>();

        return services;
    }
}
