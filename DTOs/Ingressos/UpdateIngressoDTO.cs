using System.ComponentModel.DataAnnotations;

namespace CinemaApi.DTOs;

public class UpdateIngressoDTO
{
    [Required(ErrorMessage = "A poltrona é obrigatória")]
    [MaxLength(10, ErrorMessage = "A poltrona pode ter no máximo 10 caracteres")]
    public string Poltrona { get; set; } = string.Empty;
}