using Loxena.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Loxena.Infrastructure.Data;

public class LoxenaDbContext : DbContext
{
    public LoxenaDbContext(DbContextOptions<LoxenaDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Stock> Stocks { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) 
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(LoxenaDbContext).Assembly);
    }
}
