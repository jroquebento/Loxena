using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Loxena.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStockUniqueIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Stocks_LocationId",
                table: "Stocks");

            migrationBuilder.DropIndex(
                name: "IX_Stocks_ProductId",
                table: "Stocks");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_SingleActiveProduct_PerLocation",
                table: "Stocks",
                column: "LocationId",
                unique: true,
                filter: "[PhysicalQuantity] > 0");

            migrationBuilder.CreateIndex(
                name: "IX_Stocks_ProductId_LocationId",
                table: "Stocks",
                columns: new[] { "ProductId", "LocationId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Stock_SingleActiveProduct_PerLocation",
                table: "Stocks");

            migrationBuilder.DropIndex(
                name: "IX_Stocks_ProductId_LocationId",
                table: "Stocks");

            migrationBuilder.CreateIndex(
                name: "IX_Stocks_LocationId",
                table: "Stocks",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Stocks_ProductId",
                table: "Stocks",
                column: "ProductId");
        }
    }
}
