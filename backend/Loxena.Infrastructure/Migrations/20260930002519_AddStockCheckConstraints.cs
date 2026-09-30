using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Loxena.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStockCheckConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Stock_PhysicalQuantity_NotNegative",
                table: "Stocks",
                sql: "[PhysicalQuantity] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Stock_ReservedQuantity_NotNegative",
                table: "Stocks",
                sql: "[ReservedQuantity] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Stock_ReservedQuantity_Valid",
                table: "Stocks",
                sql: "[ReservedQuantity] <= [PhysicalQuantity]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Stock_PhysicalQuantity_NotNegative",
                table: "Stocks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Stock_ReservedQuantity_NotNegative",
                table: "Stocks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Stock_ReservedQuantity_Valid",
                table: "Stocks");
        }
    }
}
