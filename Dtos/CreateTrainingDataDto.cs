using System;

namespace Dtos
{
    public class CreateTrainingDataDto
    {
        public DateTime DateTrained { get; set; }
        public int Repetitions { get; set; }
        public double WeightUsed { get; set; }
        public string Duration { get; set; } = string.Empty;
        public int RestTime { get; set; }
        public int Sets { get; set; }
        public string Notes { get; set; } = string.Empty;
        public int FrequencyCardiac { get; set; }
        public double CaloriesBurned { get; set; }
        public double DistanceCovered { get; set; }
        public double Speed { get; set; }
        public double Power { get; set; }
        public string AveragePace { get; set; } = string.Empty;
        public string NotesOfPerformance { get; set; } = string.Empty;
    }
}