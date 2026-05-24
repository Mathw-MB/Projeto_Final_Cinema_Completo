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
public class SalasController : ControllerBase
{
    private readonly AppDbContext _context;

    public SalasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<SalaDTO>>> GetAllAsync()
    {
        var salas = await _context.Salas
            .AsNoTracking()
            .ToListAsync();

        var res = salas.Select(s => new SalaDTO
        {
            Id = s.Id,
            Numero = s.Numero,
            Capacidade = s.Capacidade,
            Tipo = s.Tipo
        });

        return Ok(res);
    }

    [HttpGet("{id:int}", Name = "GetSalaById")]
    [AllowAnonymous]
    public async Task<ActionResult<SalaDTO>> GetByIdAsync(int id)
    {
        var sala = await _context.Salas
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sala is null) return NotFound();

        var res = new SalaDTO
        {
            Id = sala.Id,
            Numero = sala.Numero,
            Capacidade = sala.Capacidade,
            Tipo = sala.Tipo
        };

        return Ok(res);
    }

    [HttpGet("{id:int}/poltronas")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<string>>> GetPoltronasAsync(int id)
    {
        var sala = await _context.Salas
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sala is null) return NotFound();

        var poltronas = GerarPoltronas(sala.Capacidade);
        return Ok(poltronas);
    }

    [HttpPost]
    public async Task<ActionResult<SalaDTO>> CreateAsync(CreateSalaDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var sala = new Sala
        {
            Numero = dto.Numero,
            Capacidade = dto.Capacidade,
            Tipo = dto.Tipo
        };

        _context.Salas.Add(sala);
        await _context.SaveChangesAsync();

        return CreatedAtRoute("GetSalaById", new { id = sala.Id }, new { id = sala.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, UpdateSalaDTO dto)
    {
        var sala = await _context.Salas.FirstOrDefaultAsync(s => s.Id == id);
        if (sala is null) return NotFound();

        sala.Numero = dto.Numero;
        sala.Capacidade = dto.Capacidade;
        sala.Tipo = dto.Tipo;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var sala = await _context.Salas.FindAsync(id);
        if (sala is null) return NotFound();

        _context.Salas.Remove(sala);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    
    private static List<string> GerarPoltronas(int capacidade)
    {
        var poltronas = new List<string>();
        int assentosPorFileira = 20;
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