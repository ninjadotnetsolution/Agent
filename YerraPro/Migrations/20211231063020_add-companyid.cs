using Microsoft.EntityFrameworkCore.Migrations;

namespace YerraPro.Migrations
{
    public partial class addcompanyid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyId",
                table: "ProcessesInfos",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompnayId",
                table: "ProcessesInfos",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProcessesInfos_CompanyId",
                table: "ProcessesInfos",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProcessesInfos_Companies_CompanyId",
                table: "ProcessesInfos",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProcessesInfos_Companies_CompanyId",
                table: "ProcessesInfos");

            migrationBuilder.DropIndex(
                name: "IX_ProcessesInfos_CompanyId",
                table: "ProcessesInfos");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "ProcessesInfos");

            migrationBuilder.DropColumn(
                name: "CompnayId",
                table: "ProcessesInfos");
        }
    }
}
