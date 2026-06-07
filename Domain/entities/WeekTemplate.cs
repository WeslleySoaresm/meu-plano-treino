using System;
using System.Collections.Generic;

namespace Domain.entities
{
    public class WeekTemplate
    {
        public Guid Id { get; set; } // Id da semana, gerado automaticamente
        public int WeekNumber { get; set; } // Ex: 1, 2, 3... até 50
        public string Title { get; set; } // "Semana 1 — ajustada com dados reais do Garmin"
        public string Alert { get; set; } // Mensagem de orientação/crítica da semana
        public string FooterNote { get; set; } // Notas de encerramento da semana

        // RELAÇÃO COM O PLANO: A semana pertence a um plano específico
        public Guid PlaneId { get; set; }
        public Plane? Plane { get; set; }

        // RELAÇÃO COM OS DIAS: Uma semana possui vários dias de treino (1 para Muitos)
        public List<PlaneDay> Days { get; set; } = new List<PlaneDay>();

        public WeekTemplate() { }

        public WeekTemplate(int weekNumber, string title, string alert, string footerNote, Guid planeId)
        {
            Id = Guid.NewGuid();
            WeekNumber = weekNumber;
            Title = title;
            Alert = alert;
            FooterNote = footerNote;
            PlaneId = planeId;
        }
    }
}