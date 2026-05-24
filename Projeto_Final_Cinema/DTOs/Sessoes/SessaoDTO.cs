namespace CinemaApi.DTOs;

public class SessaoDTO
{
    public int Id { get; set; }
    public DateTime DataHora { get; set; }
    public decimal Preco { get; set; }

    
    public int FilmeId { get; set; }
    public string FilmeTitulo { get; set; } = string.Empty;

    
    public int SalaId { get; set; }
    public string SalaNumero { get; set; } = string.Empty;
    public string SalaTipo { get; set; } = string.Empty;
}