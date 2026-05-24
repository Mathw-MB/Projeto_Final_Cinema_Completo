using System.ComponentModel.DataAnnotations;

namespace CinemaApi.DTOs;

public class CreateSalaDTO
{
    [Required(ErrorMessage = "O número da sala é obrigatório")]
    [MaxLength(10, ErrorMessage = "O número pode ter no máximo 10 caracteres")]
    public string Numero { get; set; } = string.Empty;

    [Required(ErrorMessage = "A capacidade é obrigatória")]
    [Range(1, 1000, ErrorMessage = "A capacidade deve ser entre 1 e 1000 lugares")]
    public int Capacidade { get; set; }

    [Required(ErrorMessage = "O tipo é obrigatório")]
    [MaxLength(30, ErrorMessage = "O tipo pode ter no máximo 30 caracteres")]
    public string Tipo { get; set; } = string.Empty;
}