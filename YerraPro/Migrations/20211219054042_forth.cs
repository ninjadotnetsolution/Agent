using Microsoft.EntityFrameworkCore.Migrations;

namespace YerraPro.Migrations
{
    public partial class forth : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CompanyId",
                table: "Agents",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "UniqueId",
                table: "Agents",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "UniqueId",
                table: "Agents");
        }
    }
}
