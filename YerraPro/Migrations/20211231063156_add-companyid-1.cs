using Microsoft.EntityFrameworkCore.Migrations;

namespace YerraPro.Migrations
{
    public partial class addcompanyid1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompnayId",
                table: "ProcessesInfos");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompnayId",
                table: "ProcessesInfos",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
