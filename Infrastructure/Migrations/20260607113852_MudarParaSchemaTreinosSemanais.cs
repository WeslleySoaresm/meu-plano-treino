using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MudarParaSchemaTreinosSemanais : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "TreinoSemanais");

            migrationBuilder.RenameTable(
                name: "WeekTemplates",
                newName: "WeekTemplates",
                newSchema: "TreinoSemanais");

            migrationBuilder.RenameTable(
                name: "TrainingRecords",
                newName: "TrainingRecords",
                newSchema: "TreinoSemanais");

            migrationBuilder.RenameTable(
                name: "Planes",
                newName: "Planes",
                newSchema: "TreinoSemanais");

            migrationBuilder.RenameTable(
                name: "PlaneDays",
                newName: "PlaneDays",
                newSchema: "TreinoSemanais");

            migrationBuilder.RenameTable(
                name: "Persons",
                newName: "Persons",
                newSchema: "TreinoSemanais");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "WeekTemplates",
                schema: "TreinoSemanais",
                newName: "WeekTemplates");

            migrationBuilder.RenameTable(
                name: "TrainingRecords",
                schema: "TreinoSemanais",
                newName: "TrainingRecords");

            migrationBuilder.RenameTable(
                name: "Planes",
                schema: "TreinoSemanais",
                newName: "Planes");

            migrationBuilder.RenameTable(
                name: "PlaneDays",
                schema: "TreinoSemanais",
                newName: "PlaneDays");

            migrationBuilder.RenameTable(
                name: "Persons",
                schema: "TreinoSemanais",
                newName: "Persons");
        }
    }
}
