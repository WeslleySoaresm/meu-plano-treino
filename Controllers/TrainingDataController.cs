using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.entities;
using Infrastructure.Data;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class TrainingDataController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrainingDataController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Registra uma nova execução de treino (métrica de desempenho / Garmin).
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(TrainingData), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] TrainingData trainingData)
        {
            var planeExists = await _context.Planes.AnyAsync(p => p.Id == trainingData.PlaneId);
            
            if (!planeExists)
            {
                return BadRequest(new { message = "Não é possível registrar um treino para um plano inexistente." });
            }

            _context.TrainingRecords.Add(trainingData); 
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = trainingData.Id }, trainingData);
        }

        /// <summary>
        /// 🔥 ROTA GET: Lista TODOS os registros de treinamento de todos os alunos.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TrainingData>), 200)]
        public async Task<IActionResult> GetAll()
        {
            // Busca todos os treinos do banco organizados do mais recente para o mais antigo
            var records = await _context.TrainingRecords
                .OrderByDescending(t => t.DateTrained)
                .ToListAsync();

            return Ok(records);
        }

        /// <summary>
        /// ROTA GET por ID: Busca um único registro de treino específico.
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TrainingData), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var trainingData = await _context.TrainingRecords
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trainingData == null)
            {
                return NotFound(new { message = "Registro de treinamento não encontrado." });
            }

            return Ok(trainingData);
        }

        /// <summary>
        /// ROTA GET por Plano: Lista todos os treinos de um plano específico (Útil para o histórico do aluno).
        /// </summary>
        [HttpGet("by-plane/{planeId}")]
        [ProducesResponseType(typeof(IEnumerable<TrainingData>), 200)]
        public async Task<IActionResult> GetByPlane(Guid planeId)
        {
            var records = await _context.TrainingRecords
                .Where(t => t.PlaneId == planeId)
                .OrderByDescending(t => t.DateTrained)
                .ToListAsync();

            return Ok(records);
        }
    }
}