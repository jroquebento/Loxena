using Loxena.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Loxena.Infrastructure.Data.Configurations;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(c => c.Document)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.Phone)
            .IsRequired()
            .HasMaxLength(20);

        builder.ToTable(t =>
        {
            t.HasCheckConstraint("CK_Customer_Email_Format", "[Email] LIKE '%@%'");
        });

        builder.HasIndex(c => c.Email).IsUnique();
        builder.HasIndex(c => c.Document).IsUnique();
    }
}
