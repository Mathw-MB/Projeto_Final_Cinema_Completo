using System.ComponentModel.DataAnnotations;

namespace CinemaApi.Models;

public class Ingresso
{
    public int Id { get; set; }

    [Required(ErrorMessage = "A poltrona é obrigatória")]
    [MaxLength(10, ErrorMessage = "A poltrona pode ter no máximo 10 caracteres")]
    public string Poltrona { get; set; } = string.Empty;

    public DateTime DataCompra { get; set; } = DateTime.Now;

    
    [Required(ErrorMessage = "A sessão é obrigatória")]
    public int SessaoId { get; set; }
    public Sessao? Sessao { get; set; }

   
    [Required(ErrorMessage = "O usuário é obrigatório")]
    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
}