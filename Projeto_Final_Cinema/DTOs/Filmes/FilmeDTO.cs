namespace CinemaApi.DTOs;

public class FilmeDTO
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Genero { get; set; } = string.Empty;
    public int DuracaoMinutos { get; set; }
    public string Classificacao { get; set; } = string.Empty;
    public string? Sinopse { get; set; }
}