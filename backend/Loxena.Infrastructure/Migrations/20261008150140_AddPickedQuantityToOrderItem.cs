using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Loxena.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPickedQuantityToOrderItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PickedQuantity",
                table: "OrderItems",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PickedQuantity",
                table: "OrderItems");
        }
    }
}
