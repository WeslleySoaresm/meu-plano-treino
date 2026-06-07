using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.entities;
using Infrastructure.Data;
using System;
using System.Threading.Tasks;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class PlaneController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlaneController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [ProducesResponseType(typeof(Plane), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] Plane plane)
        {
            var personExists = await _context.Persons.AnyAsync(p => p.Id == plane.PersonId);
            
            if (!personExists)
            {
                return BadRequest(new { message = "Não é possível criar um plano para um usuário inexistente." });
            }

            _context.Planes.Add(plane);
            await _context.SaveChangesAsync();

            // Ajustado para apontar para o GetById
            return CreatedAtAction(nameof(GetById), new { id = plane.Id }, plane);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Plane), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var plane = await _context.Planes
                .Include(p => p.WeeksStructure)          
                    .ThenInclude(w => w.Days)            
                .FirstOrDefaultAsync(p => p.Id == id);   

            if (plane == null)
            {
                return NotFound(new { message = "Plano de treino não encontrado." });
            }

            return Ok(plane);
        }
    }
}