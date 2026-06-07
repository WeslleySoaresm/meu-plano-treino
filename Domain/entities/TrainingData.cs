using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.entities
{
    public class TrainingData
    {
        public Guid Id { get; set; } //id do dado de treinamento, do tipo guid, para ser gerado automaticamente, e não pode ser nulo {do dado de treinamento}

        public DateTime DateTrained { get; set; } //data do treinamento, para ser gerada automaticamente
        
        //Metricas de desempenho
        public int Repetitions { get; set; } //repetições do exercício
        public float WeightUsed { get; set; } //peso utilizado no exercício
        public TimeSpan Duration { get; set; } //duração do exercício
        public int RestTime { get; set; } //tempo de descanso entre as séries, em segundos
        public int Sets { get; set; } //séries do exercício 

        public string Notes { get; set; } //notas do treinamento, para ser associada ao dado de treinamento

        public int FrequencyCardiac { get; set; } //frequência cardíaca durante o exercício, para ser associada ao dado de treinamento

        public float CaloriesBurned { get; set; } //calorias queimadas durante o exercício, para ser associada ao dado de treinamento

        public float DistanceCovered { get; set; } //distância percorrida durante o exercício, para ser associada ao dado de treinamento

        public float Speed { get; set; } //velocidade durante o exercício, para ser associada ao dado de treinamento

        public float Power { get; set; } //potência durante o exercício, para ser associada ao dado de treinamento

        public TimeSpan AveragePace { get; set; } //ritmo médio durante o exercício, para ser associada ao dado de treinamento

        public string NotesOfPerformance { get; set; } //notas de desempenho durante o exercício, para ser associada ao dado de treinamento


        //chave estrangeira para associar o dado de treinamento ao plano    
        public Guid PlaneId { get; set; } //id do plano, para ser associada ao plano
        public Plane? Plane { get; set; } //plano associado ao dado de treinamento

        public TrainingData() //construtor vazio para o Entity Framework
        {
        }   

        //construtor para criar uma nova instância da classe TrainingData
        public TrainingData(DateTime dateTrained, int repetitions, float weightUsed, TimeSpan duration, int restTime, int sets, string notes, int frequencyCardiac, float caloriesBurned, float distanceCovered, float speed, float power, TimeSpan averagePace, string notesOfPerformance, Guid planeId)
        {
            Id = Guid.NewGuid(); //gerar um novo id automaticamente
            DateTrained = dateTrained;
            Repetitions = repetitions;
            WeightUsed = weightUsed;
            Duration = duration;
            RestTime = restTime;
            Sets = sets;
            Notes = notes;
            FrequencyCardiac = frequencyCardiac;
            CaloriesBurned = caloriesBurned;
            DistanceCovered = distanceCovered;
            Speed = speed;
            Power = power;
            AveragePace = averagePace;
            NotesOfPerformance = notesOfPerformance;
            PlaneId = planeId; // Associado diretamente no construtor para manter a integridade
        }
    }
}