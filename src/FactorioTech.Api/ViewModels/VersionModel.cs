using NodaTime;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class VersionModel
    {
        [Required]
        public Instant CreatedAt { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public PayloadModel? Payload { get; set; }
    }
}
