using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace YerraPro.Migrations
{
    public partial class second : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "EmailIndex",
                table: "User");

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordSalt",
                table: "User",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "User",
                column: "NormalizedEmail",
                unique: true,
                filter: "[NormalizedEmail] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "EmailIndex",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PasswordSalt",
                table: "User");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "User",
                column: "NormalizedEmail");
        }
    }
}
