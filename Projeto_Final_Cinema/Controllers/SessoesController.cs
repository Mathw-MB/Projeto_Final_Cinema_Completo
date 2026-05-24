using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaApi.Data;
using CinemaApi.DTOs;
using CinemaApi.Models;

namespace CinemaApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SessoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SessoesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<SessaoDTO>>> GetAllAsync()
    {
        var sessoes = await _context.Sessoes
            .Include(s => s.Filme)
            .Include(s => s.Sala)
            .AsNoTracking()
            .ToListAsync();

        var res = sessoes.Select(s => new SessaoDTO
        {
            Id = s.Id,
            DataHora = s.DataHora,
            Preco = s.Preco,
            FilmeId = s.FilmeId,
            FilmeTitulo = s.Filme!.Titulo,
            SalaId = s.SalaId,
            SalaNumero = s.Sala!.Numero,
            SalaTipo = s.Sala!.Tipo
        });

        return Ok(res);
    }

    [HttpGet("{id:int}", Name = "GetSessaoById")]
    [AllowAnonymous]
    public async Task<ActionResult<SessaoDTO>> GetByIdAsync(int id)
    {
        var sessao = await _context.Sessoes
            .Include(s => s.Filme)
            .Include(s => s.Sala)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sessao is null) return NotFound();

        var res = new SessaoDTO
        {
            Id = sessao.Id,
            DataHora = sessao.DataHora,
            Preco = sessao.Preco,
            FilmeId = sessao.FilmeId,
            FilmeTitulo = sessao.Filme!.Titulo,
            SalaId = sessao.SalaId,
            SalaNumero = sessao.Sala!.Numero,
            SalaTipo = sessao.Sala!.Tipo
        };

        return Ok(res);
    }


    [HttpGet("{id:int}/poltronas-disponiveis")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<string>>> GetPoltronasDisponiveisAsync(int id)
    {
        var sessao = await _context.Sessoes
            .Include(s => s.Sala)
            .Include(s => s.Ingressos)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sessao is null) return NotFound();

        var todasPoltronas = GerarPoltronas(sessao.Sala!.Capacidade);
        var ocupadas = sessao.Ingressos.Select(i => i.Poltrona).ToHashSet();
        var disponiveis = todasPoltronas.Where(p => !ocupadas.Contains(p)).ToList();

        return Ok(disponiveis);
    }

    [HttpPost]
    public async Task<ActionResult<SessaoDTO>> CreateAsync(CreateSessaoDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var filmeExiste = await _context.Filmes.AnyAsync(f => f.Id == dto.FilmeId);
        if (!filmeExiste) return BadRequest(new { message = "Filme não encontrado." });

        var salaExiste = await _context.Salas.AnyAsync(s => s.Id == dto.SalaId);
        if (!salaExiste) return BadRequest(new { message = "Sala não encontrada." });

       
        var conflito = await _context.Sessoes.AnyAsync(s =>
            s.SalaId == dto.SalaId &&
            Math.Abs(EF.Functions.DateDiffMinute(s.DataHora, dto.DataHora)) < 10);

        if (conflito)
            return BadRequest(new { message = "Já existe uma sessão nessa sala nesse horário." });

        var sessao = new Sessao
        {
            DataHora = dto.DataHora,
            Preco = dto.Preco,
            FilmeId = dto.FilmeId,
            SalaId = dto.SalaId
        };

        _context.Sessoes.Add(sessao);
        await _context.SaveChangesAsync();

        return CreatedAtRoute("GetSessaoById", new { id = sessao.Id }, new { id = sessao.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, UpdateSessaoDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var sessao = await _context.Sessoes.FirstOrDefaultAsync(s => s.Id == id);
        if (sessao is null) return NotFound();

        var filmeExiste = await _context.Filmes.AnyAsync(f => f.Id == dto.FilmeId);
        if (!filmeExiste) return BadRequest(new { message = "Filme não encontrado." });

        var salaExiste = await _context.Salas.AnyAsync(s => s.Id == dto.SalaId);
        if (!salaExiste) return BadRequest(new { message = "Sala não encontrada." });

        
        var conflito = await _context.Sessoes.AnyAsync(s =>
            s.Id != id &&
            s.SalaId == dto.SalaId &&
            Math.Abs(EF.Functions.DateDiffMinute(s.DataHora, dto.DataHora)) < 10);

        if (conflito)
            return BadRequest(new { message = "Já existe uma sessão nessa sala nesse horário." });

        sessao.DataHora = dto.DataHora;
        sessao.Preco = dto.Preco;
        sessao.FilmeId = dto.FilmeId;
        sessao.SalaId = dto.SalaId;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var sessao = await _context.Sessoes.FindAsync(id);
        if (sessao is null) return NotFound();

        _context.Sessoes.Remove(sessao);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static List<string> GerarPoltronas(int capacidade)
    {
        var poltronas = new List<string>();
        int assentosPorFileira = 15;
        char letra = 'A';
        int restante = capacidade;

        while (restante > 0)
        {
            int nesta = Math.Min(assentosPorFileira, restante);
            for (int n = 1; n <= nesta; n++)
                poltronas.Add($"{letra}{n}");

            letra++;
            restante -= nesta;
        }

        return poltronas;
    }
}