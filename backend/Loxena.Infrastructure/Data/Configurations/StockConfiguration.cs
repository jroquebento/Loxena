using Loxena.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Loxena.Infrastructure.Data.Configurations;

public class StockConfiguration : IEntityTypeConfiguration<Stock>
{
    public void Configure(EntityTypeBuilder<Stock> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.PhysicalQuantity)
            .IsRequired();

        builder.Property(s => s.ReservedQuantity)
            .IsRequired();

        builder.Ignore(s => s.AvailableQuantity);

        builder.Property<byte[]>("RowVersion")
            .IsRowVersion();

        builder.ToTable(t =>
        {
            t.HasCheckConstraint("CK_Stock_PhysicalQuantity_NotNegative", "[PhysicalQuantity] >= 0");
            t.HasCheckConstraint("CK_Stock_ReservedQuantity_NotNegative", "[ReservedQuantity] >= 0");
            t.HasCheckConstraint("CK_Stock_ReservedQuantity_Valid", "[ReservedQuantity] <= [PhysicalQuantity]");
        });

        builder.HasIndex(s => new { s.ProductId, s.LocationId })
            .IsUnique();

        builder.HasIndex(s => s.LocationId)
            .IsUnique()
            .HasFilter("[PhysicalQuantity] > 0")
            .HasDatabaseName("IX_Stock_SingleActiveProduct_PerLocation");

        builder.HasOne<Product>()
            .WithMany()
            .HasForeignKey(s => s.ProductId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Location>()
            .WithMany()
            .HasForeignKey(s => s.LocationId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}
