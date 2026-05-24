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
public class FilmesController : ControllerBase
{
    private readonly AppDbContext _context;

    public FilmesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<FilmeDTO>>> GetAllAsync()
    {
        var filmes = await _context.Filmes
            .AsNoTracking()
            .ToListAsync();

        var res = filmes.Select(f => new FilmeDTO
        {
            Id = f.Id,
            Titulo = f.Titulo,
            Genero = f.Genero,
            DuracaoMinutos = f.DuracaoMinutos,
            Classificacao = f.Classificacao,
            Sinopse = f.Sinopse
        });

        return Ok(res);
    }

    [HttpGet("{id:int}", Name = "GetFilmeById")]
    [AllowAnonymous]
    public async Task<ActionResult<FilmeDTO>> GetByIdAsync(int id)
    {
        var filme = await _context.Filmes
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == id);

        if (filme is null) return NotFound();

        var res = new FilmeDTO
        {
            Id = filme.Id,
            Titulo = filme.Titulo,
            Genero = filme.Genero,
            DuracaoMinutos = filme.DuracaoMinutos,
            Classificacao = filme.Classificacao,
            Sinopse = filme.Sinopse
        };

        return Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<FilmeDTO>> CreateAsync(CreateFilmeDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var filme = new Filme
        {
            Titulo = dto.Titulo,
            Genero = dto.Genero,
            DuracaoMinutos = dto.DuracaoMinutos,
            Classificacao = dto.Classificacao,
            Sinopse = dto.Sinopse
        };

        _context.Filmes.Add(filme);
        await _context.SaveChangesAsync();

        return CreatedAtRoute("GetFilmeById", new { id = filme.Id }, new { id = filme.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, UpdateFilmeDTO dto)
    {
        var filme = await _context.Filmes.FirstOrDefaultAsync(f => f.Id == id);

        if (filme is null) return NotFound();

        filme.Titulo = dto.Titulo;
        filme.Genero = dto.Genero;
        filme.DuracaoMinutos = dto.DuracaoMinutos;
        filme.Classificacao = dto.Classificacao;
        filme.Sinopse = dto.Sinopse;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var filme = await _context.Filmes.FindAsync(id);

        if (filme is null) return NotFound();

        _context.Filmes.Remove(filme);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}