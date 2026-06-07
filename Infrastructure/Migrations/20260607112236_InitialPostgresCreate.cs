using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgresCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Persons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Weight = table.Column<float>(type: "real", nullable: false),
                    Height = table.Column<float>(type: "real", nullable: false),
                    EngageInPhysicalActivity = table.Column<bool>(type: "boolean", nullable: false),
                    PhysicalActivity = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Persons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Planes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NameOfPlane = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Objective = table.Column<string>(type: "text", nullable: false),
                    Difficulty = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<string>(type: "text", nullable: false),
                    TargetMuscleGroups = table.Column<string>(type: "text", nullable: false),
                    Equipment = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Weeks = table.Column<int>(type: "integer", nullable: false),
                    DaysPerWeek = table.Column<int>(type: "integer", nullable: false),
                    PersonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Planes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Planes_Persons_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DateTrained = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Repetitions = table.Column<int>(type: "integer", nullable: false),
                    WeightUsed = table.Column<float>(type: "real", nullable: false),
                    Duration = table.Column<TimeSpan>(type: "interval", nullable: false),
                    RestTime = table.Column<int>(type: "integer", nullable: false),
                    Sets = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    FrequencyCardiac = table.Column<int>(type: "integer", nullable: false),
                    CaloriesBurned = table.Column<float>(type: "real", nullable: false),
                    DistanceCovered = table.Column<float>(type: "real", nullable: false),
                    Speed = table.Column<float>(type: "real", nullable: false),
                    Power = table.Column<float>(type: "real", nullable: false),
                    AveragePace = table.Column<TimeSpan>(type: "interval", nullable: false),
                    NotesOfPerformance = table.Column<string>(type: "text", nullable: false),
                    PlaneId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingRecords_Planes_PlaneId",
                        column: x => x.PlaneId,
                        principalTable: "Planes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WeekTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WeekNumber = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Alert = table.Column<string>(type: "text", nullable: false),
                    FooterNote = table.Column<string>(type: "text", nullable: false),
                    PlaneId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeekTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WeekTemplates_Planes_PlaneId",
                        column: x => x.PlaneId,
                        principalTable: "Planes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlaneDays",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DayIdentifier = table.Column<string>(type: "text", nullable: false),
                    DayName = table.Column<string>(type: "text", nullable: false),
                    TagText = table.Column<string>(type: "text", nullable: false),
                    TagColor = table.Column<string>(type: "text", nullable: false),
                    TimeInfo = table.Column<string>(type: "text", nullable: false),
                    BodyBatteryInstruction = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    IsCardio = table.Column<bool>(type: "boolean", nullable: false),
                    ContentRaw = table.Column<string>(type: "text", nullable: false),
                    WeekTemplateId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaneDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlaneDays_WeekTemplates_WeekTemplateId",
                        column: x => x.WeekTemplateId,
                        principalTable: "WeekTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlaneDays_WeekTemplateId",
                table: "PlaneDays",
                column: "WeekTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_Planes_PersonId",
                table: "Planes",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingRecords_PlaneId",
                table: "TrainingRecords",
                column: "PlaneId");

            migrationBuilder.CreateIndex(
                name: "IX_WeekTemplates_PlaneId",
                table: "WeekTemplates",
                column: "PlaneId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlaneDays");

            migrationBuilder.DropTable(
                name: "TrainingRecords");

            migrationBuilder.DropTable(
                name: "WeekTemplates");

            migrationBuilder.DropTable(
                name: "Planes");

            migrationBuilder.DropTable(
                name: "Persons");
        }
    }
}
