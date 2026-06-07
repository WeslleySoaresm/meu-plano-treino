using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.entities;
using Infrastructure.Data;

namespace YourProject.Controllers
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
        /// Grava o histórico real de execução de um treino (Ação: Confirmar e Salvar Registro).
        /// </summary>
        /// <response code="201">Histórico gravado com sucesso no banco de dados.</response>
        /// <response code="400">Se o plano associado não for encontrado.</response>
        [HttpPost("record")]
        [ProducesResponseType(typeof(TrainingData), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> SaveWorkoutRecord([FromBody] TrainingRecordDto dto)
        {
            var planeExists = await _context.Planes.AnyAsync(p => p.Id == dto.PlaneId);
            if (!planeExists)
            {
                return BadRequest(new { message = "Plano de treino associado não existe." });
            }

            // Instancia a Entidade mapeando os dados com base no tipo de treino vindo do front
            var newRecord = new TrainingData
            {
                Id = Guid.NewGuid(),
                PlaneId = dto.PlaneId,
                DateTrained = DateTime.UtcNow,
                Notes = dto.Notes,
                NotesOfPerformance = $"Registrado para o dia: {dto.DayName} - {dto.Title}"
            };

            if (dto.IsCardio)
            {
                // Trata as métricas genéricas como dados de Corrida
                newRecord.Speed = float.TryParse(dto.Metric1, out var speed) ? speed : 0; // Ex: Interpretado via Pace ou Velocidade
                newRecord.FrequencyCardiac = int.TryParse(dto.Metric2, out var fcMed) ? fcMed : 0;
                // Armazena a FC Máxima (Metric3) concatenada ou em campo customizado se necessário
            }
            else
            {
                // Trata as métricas genéricas como dados de Força
                newRecord.WeightUsed = float.TryParse(dto.Metric1, out var weight) ? weight : 0;
                newRecord.Repetitions = int.TryParse(dto.Metric2, out var reps) ? reps : 0;
            }

            _context.TrainingRecords.Add(newRecord);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(SaveWorkoutRecord), new { id = newRecord.Id }, newRecord);
        }

        /// <summary>
        /// Deleta o registro de execução do banco de dados (Ação: Confirmar Exclusão no Alerta).
        /// </summary>
        /// <param name="id">ID Único (GUID) do registro a ser apagado.</param>
        /// <response code="204">Registro removido com sucesso.</response>
        /// <response code="404">Se o registro não for encontrado.</response>
        [HttpDelete("record/{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ClearRecord(Guid id)
        {
            var record = await _context.TrainingRecords.FindAsync(id);
            if (record == null)
            {
                return NotFound(new { message = "Registro de treinamento não encontrado." });
            }

            _context.TrainingRecords.Remove(record);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    /// <summary>
    /// Objeto de Transferência de Dados (DTO) para alinhar as propriedades dinâmicas do React com a API.
    /// </summary>
    public class TrainingRecordDto
    {
        public Guid PlaneId { get; set; }
        public string DayId { get; set; }
        public string DayName { get; set; }
        public string Title { get; set; }
        public bool IsCardio { get; set; }
        public string Metric1 { get; set; } // val1 do front
        public string Metric2 { get; set; } // val2 do front
        public string Metric3 { get; set; } // val3 do front
        public string Notes { get; set; }
    }
}