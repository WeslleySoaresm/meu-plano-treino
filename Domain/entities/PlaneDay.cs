using System;
using System.Collections.Generic;

namespace Domain.entities
{
    public class PlaneDay
    {
        public Guid Id { get; set; }
        public string DayIdentifier { get; set; } // O "w1_d1" do front para dar o match
        public string DayName { get; set; } // "Segunda-feira — Dia 1"
        public string TagText { get; set; } // "Zona 2", "Força"
        public string TagColor { get; set; } // Cores do Tailwind
        public string TimeInfo { get; set; } // "35-40 min"
        public string BodyBatteryInstruction { get; set; }
        public string Title { get; set; }
        public bool IsCardio { get; set; }
        public string ContentRaw { get; set; } // Instruções unidas por quebra de linha (\n)

        // RELAÇÃO AJUSTADA: O dia agora pertence a uma Semana específica
        public Guid WeekTemplateId { get; set; }
        public WeekTemplate? WeekTemplate { get; set; }
    }
}