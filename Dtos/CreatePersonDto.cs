
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dtos
{
    public class CreatePersonDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
        public double Weight { get; set; }
        public double Height { get; set; }
        public bool EngageInPhysicalActivity { get; set; }
        public string PhysicalActivity { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;

        // 🔥 Agora usamos os DTOs aqui, o que remove as propriedades circulares chatas!
        public List<CreatePlaneDto> Planes { get; set; } = new();
    }
}