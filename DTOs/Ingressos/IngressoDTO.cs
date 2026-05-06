namespace CinemaApi.DTOs;

public class IngressoDTO
{
    public int Id { get; set; }
    public string Poltrona { get; set; } = string.Empty;
    public DateTime DataCompra { get; set; }

    // Dados da Sessão vinculada
    public int SessaoId { get; set; }
    public DateTime SessaoDataHora { get; set; }
    public decimal SessaoPreco { get; set; }
    public string FilmeTitulo { get; set; } = string.Empty;
    public string SalaNumero { get; set; } = string.Empty;

    // Dados do Usuário vinculado
    public int UsuarioId { get; set; }
    public string UsuarioEmail { get; set; } = string.Empty;
}