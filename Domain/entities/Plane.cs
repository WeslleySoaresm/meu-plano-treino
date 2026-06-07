using System;
using System.Collections.Generic;

namespace Domain.entities
{
    public class Plane 
    {
        public Guid Id { get; set; } 
        public string NameOfPlane { get; set; } 
        public string Description { get; set; } 
        public string Objective { get; set; } 
        public string Difficulty { get; set; } 
        public string Duration { get; set; } 
        public string TargetMuscleGroups { get; set; } 
        public string Equipment { get; set; } 
        public string ImageUrl { get; set; } 
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow; 
        public int Weeks { get; set; } 
        public int DaysPerWeek { get; set; } 

        // RELAÇÃO COM USER
        public Guid PersonId { get; set; } 
        public Person? Person { get; set; }
        
        // RELAÇÃO COM AS SEMANAS (O Plane gerencia as 50 semanas)
        public List<WeekTemplate> WeeksStructure { get; set; } = new List<WeekTemplate>(); 

        // RELAÇÃO COM OS REGISTROS DE EXECUÇÃO DO ALUNO
        public List<TrainingData> Training { get; set; } = new List<TrainingData>(); 

        public Plane() { }
        
        public Plane(string name, string description, string objective, string difficulty, string duration, string targetMuscleGroups, string equipment, string imageUrl, Guid personId)
        {
            Id = Guid.NewGuid(); 
            NameOfPlane = name;
            Description = description;
            Objective = objective;
            Difficulty = difficulty;
            Duration = duration;
            TargetMuscleGroups = targetMuscleGroups;
            Equipment = equipment;
            ImageUrl = imageUrl;
            PersonId = personId;
        }
    }
}