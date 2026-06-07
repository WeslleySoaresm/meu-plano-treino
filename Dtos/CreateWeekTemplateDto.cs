using System.Collections.Generic;

namespace Dtos
{
    public class CreateWeekTemplateDto
    {
        public int WeekNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Alert { get; set; } = string.Empty;
        public string FooterNote { get; set; } = string.Empty;
        public List<CreatePlaneDayDto> Days { get; set; } = new();
    }
}