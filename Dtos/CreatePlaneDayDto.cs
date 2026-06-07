namespace Dtos
{
    public class CreatePlaneDayDto
    {
        public string DayIdentifier { get; set; } = string.Empty;
        public string DayName { get; set; } = string.Empty;
        public string TagText { get; set; } = string.Empty;
        public string TagColor { get; set; } = string.Empty;
        public string TimeInfo { get; set; } = string.Empty;
        public string BodyBatteryInstruction { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public bool IsCardio { get; set; }
        public string ContentRaw { get; set; } = string.Empty;
    }
}