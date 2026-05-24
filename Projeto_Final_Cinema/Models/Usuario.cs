using System.ComponentModel.DataAnnotations;

namespace CinemaApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Senha { get; set; } = string.Empty;
    }
}