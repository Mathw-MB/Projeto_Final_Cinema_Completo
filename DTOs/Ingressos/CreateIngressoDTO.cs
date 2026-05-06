using System.ComponentModel.DataAnnotations;

namespace CinemaApi.DTOs;

public class CreateIngressoDTO
{
    [Required(ErrorMessage = "A poltrona é obrigatória")]
    [MaxLength(10, ErrorMessage = "A poltrona pode ter no máximo 10 caracteres")]
    public string Poltrona { get; set; } = string.Empty;

    [Required(ErrorMessage = "O ID da sessão é obrigatório")]
    public int SessaoId { get; set; }

    [Required(ErrorMessage = "O ID do usuário é obrigatório")]
    public int UsuarioId { get; set; }
}