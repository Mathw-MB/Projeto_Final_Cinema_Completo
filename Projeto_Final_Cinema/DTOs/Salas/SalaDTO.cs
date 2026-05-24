namespace CinemaApi.DTOs;

public class SalaDTO
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public int Capacidade { get; set; }
    public string Tipo { get; set; } = string.Empty;
}