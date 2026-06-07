using System.Collections.Generic;

namespace Dtos
{
    public class CreatePlaneDto
    {
        public string NameOfPlane { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Objective { get; set; } = string.Empty;
        public string Difficulty { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public string TargetMuscleGroups { get; set; } = string.Empty;
        public string Equipment { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int Weeks { get; set; }
        public int DaysPerWeek { get; set; }
        public List<CreateWeekTemplateDto> WeeksStructure { get; set; } = new();
        public List<CreateTrainingDataDto> Training { get; set; } = new();
    }
}