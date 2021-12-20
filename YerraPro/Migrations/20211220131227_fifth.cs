using Microsoft.EntityFrameworkCore.Migrations;

namespace YerraPro.Migrations
{
    public partial class fifth : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UniqueId",
                table: "Agents");

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "Agents",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Domain",
                table: "Agents",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "Domain",
                table: "Agents");

            migrationBuilder.AddColumn<string>(
                name: "UniqueId",
                table: "Agents",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
