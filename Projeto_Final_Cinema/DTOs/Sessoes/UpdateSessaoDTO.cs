using System.ComponentModel.DataAnnotations;

namespace CinemaApi.DTOs;

public class UpdateSessaoDTO
{
    [Required(ErrorMessage = "A data e hora são obrigatórias")]
    public DateTime DataHora { get; set; }

    [Required(ErrorMessage = "O preço é obrigatório")]
    [Range(0.01, 9999.99, ErrorMessage = "O preço deve ser entre R$0,01 e R$9999,99")]
    public decimal Preco { get; set; }

    [Required(ErrorMessage = "O ID do filme é obrigatório")]
    public int FilmeId { get; set; }

    [Required(ErrorMessage = "O ID da sala é obrigatório")]
    public int SalaId { get; set; }
}