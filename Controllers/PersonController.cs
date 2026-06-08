using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using Domain.entities; 
using Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore; 

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PersonController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Create([FromBody] CreatePersonDto dto)
        {
            try
            {
                // 1. Criamos a entidade Person raiz
                var person = new Person
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    DataNascimento = dto.DataNascimento,
                    Weight = (float)dto.Weight, 
                    Height = (float)dto.Height, 
                    EngageInPhysicalActivity = dto.EngageInPhysicalActivity,
                    PhysicalActivity = dto.PhysicalActivity,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    DataCriacao = DateTime.UtcNow,
                    Planes = new List<Plane>() 
                };

                // 2. Mapeamos os Planos de Treino (em cascata)
                if (dto.Planes != null)
                {
                    foreach (var planeDto in dto.Planes)
                    {
                        var plane = new Plane
                        {
                            Id = Guid.NewGuid(),
                            NameOfPlane = planeDto.NameOfPlane,
                            Description = planeDto.Description,
                            Objective = planeDto.Objective,
                            Difficulty = planeDto.Difficulty,
                            Duration = planeDto.Duration,
                            TargetMuscleGroups = planeDto.TargetMuscleGroups,
                            Equipment = planeDto.Equipment,
                            ImageUrl = planeDto.ImageUrl,
                            Weeks = planeDto.Weeks,
                            DaysPerWeek = planeDto.DaysPerWeek,
                            DataCriacao = DateTime.UtcNow,
                            WeeksStructure = new List<WeekTemplate>(),
                            Training = new List<TrainingData>()
                        };

                        foreach (var weekDto in planeDto.WeeksStructure ?? new())
                        {
                            var week = new WeekTemplate
                            {
                                Id = Guid.NewGuid(),
                                WeekNumber = weekDto.WeekNumber,
                                Title = weekDto.Title,
                                Alert = weekDto.Alert,
                                FooterNote = weekDto.FooterNote,
                                Days = new List<PlaneDay>()
                            };

                            foreach (var dayDto in weekDto.Days ?? new())
                            {
                                var day = new PlaneDay
                                {
                                    Id = Guid.NewGuid(),
                                    DayIdentifier = dayDto.DayIdentifier,
                                    DayName = dayDto.DayName,
                                    TagText = dayDto.TagText,
                                    TagColor = dayDto.TagColor,
                                    TimeInfo = dayDto.TimeInfo,
                                    BodyBatteryInstruction = dayDto.BodyBatteryInstruction,
                                    Title = dayDto.Title,
                                    IsCardio = dayDto.IsCardio,
                                    ContentRaw = dayDto.ContentRaw
                                };
                                week.Days.Add(day);
                            }
                            plane.WeeksStructure.Add(week);
                        }

                        foreach (var trainDto in planeDto.Training ?? new())
                        {
                            var training = new TrainingData
                            {
                                Id = Guid.NewGuid(),
                                DateTrained = trainDto.DateTrained,
                                Repetitions = trainDto.Repetitions,
                                WeightUsed = (float)trainDto.WeightUsed, 
                                Duration = string.IsNullOrEmpty(trainDto.Duration) ? TimeSpan.Zero : TimeSpan.Parse(trainDto.Duration), 
                                RestTime = trainDto.RestTime,
                                Sets = trainDto.Sets,
                                Notes = trainDto.Notes,
                                FrequencyCardiac = trainDto.FrequencyCardiac,
                                CaloriesBurned = (float)trainDto.CaloriesBurned, 
                                DistanceCovered = (float)trainDto.DistanceCovered, 
                                Speed = (float)trainDto.Speed, 
                                Power = (float)trainDto.Power, 
                                AveragePace = string.IsNullOrEmpty(trainDto.AveragePace) ? TimeSpan.Zero : TimeSpan.Parse(trainDto.AveragePace), 
                                NotesOfPerformance = trainDto.NotesOfPerformance
                            };
                            plane.Training.Add(training);
                        }

                        person.Planes.Add(plane);
                    }
                }

                _context.Persons.Add(person); 
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = person.Id }, person);
            }
            catch (Exception ex)
            {
                // 🎯 Retorna o erro exato se algo der errado no banco ou nos dados
                return BadRequest(new { error = ex.Message, inner = ex.InnerException?.Message, stack = ex.StackTrace });
            }
        } // 🔓 Chave de fechamento do método Create corrigida aqui!

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var person = await _context.Persons.FindAsync(id); 
            if (person == null) return NotFound();
            return Ok(person);
        }
        
        [HttpGet("ListarTodos")]
        public async Task<IActionResult> ListarTodos()
        {
            var usuarios = await _context.Persons.Include(u => u.Planes).ToListAsync();
            return Ok(usuarios);
        }
    }
}