using System.ComponentModel.DataAnnotations;

namespace CinemaApi.DTOs;

public class CreateFilmeDTO
{
    [Required(ErrorMessage = "O título é obrigatório")]
    [MaxLength(150, ErrorMessage = "O título pode ter no máximo 150 caracteres")]
    public string Titulo { get; set; } = string.Empty;

    [Required(ErrorMessage = "O gênero é obrigatório")]
    [MaxLength(50, ErrorMessage = "O gênero pode ter no máximo 50 caracteres")]
    public string Genero { get; set; } = string.Empty;

    [Required(ErrorMessage = "A duração é obrigatória")]
    [Range(1, 600, ErrorMessage = "A duração deve ser entre 1 e 600 minutos")]
    public int DuracaoMinutos { get; set; }

    [Required(ErrorMessage = "A classificação é obrigatória")]
    [MaxLength(10, ErrorMessage = "A classificação pode ter no máximo 10 caracteres")]
    public string Classificacao { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "A sinopse pode ter no máximo 500 caracteres")]
    public string? Sinopse { get; set; }
}