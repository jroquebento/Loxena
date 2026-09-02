using Loxena.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Loxena.Infrastructure.Data;

public class LoxenaDbContext : DbContext
{
    public LoxenaDbContext(DbContextOptions<LoxenaDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) 
    {
        modelBuilder.Entity<Category>(entity => 
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);
        });

        modelBuilder.Entity<Product>(entity => 
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(p => p.Description)
                .HasMaxLength(2000);

            entity.Property(p => p.Price)
                .HasPrecision(18, 2);

            entity.Property(p => p.IsActive)
                .IsRequired();

            entity.HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .IsRequired();
        });
    }
}
