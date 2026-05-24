using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaApi.Models;

public class Sessao
{
    public int Id { get; set; }

    [Required(ErrorMessage = "A data e hora são obrigatórias")]
    public DateTime DataHora { get; set; }

    [Required(ErrorMessage = "O preço é obrigatório")]
    [Range(0.01, 9999.99, ErrorMessage = "O preço deve ser entre R$0,01 e R$9999,99")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Preco { get; set; }

    
    [Required(ErrorMessage = "O filme é obrigatório")]
    public int FilmeId { get; set; }
    public Filme? Filme { get; set; }

  
    [Required(ErrorMessage = "A sala é obrigatória")]
    public int SalaId { get; set; }
    public Sala? Sala { get; set; }

    
    public ICollection<Ingresso> Ingressos { get; set; } = new List<Ingresso>();
}