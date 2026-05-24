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
public class IngresosController : ControllerBase
{
    private readonly AppDbContext _context;

    public IngresosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<IngressoDTO>>> GetAllAsync()
    {
        var ingressos = await _context.Ingressos
            .Include(i => i.Sessao)
                .ThenInclude(s => s!.Filme)
            .Include(i => i.Sessao)
                .ThenInclude(s => s!.Sala)
            .Include(i => i.Usuario)
            .AsNoTracking()
            .ToListAsync();

        var res = ingressos.Select(i => new IngressoDTO
        {
            Id = i.Id,
            Poltrona = i.Poltrona,
            DataCompra = i.DataCompra,
            SessaoId = i.SessaoId,
            SessaoDataHora = i.Sessao!.DataHora,
            SessaoPreco = i.Sessao!.Preco,
            FilmeTitulo = i.Sessao!.Filme!.Titulo,
            SalaNumero = i.Sessao!.Sala!.Numero,
            UsuarioId = i.UsuarioId,
            UsuarioEmail = i.Usuario!.Email
        });

        return Ok(res);
    }

    [HttpGet("{id:int}", Name = "GetIngressoById")]
    [AllowAnonymous]
    public async Task<ActionResult<IngressoDTO>> GetByIdAsync(int id)
    {
        var ingresso = await _context.Ingressos
            .Include(i => i.Sessao)
                .ThenInclude(s => s!.Filme)
            .Include(i => i.Sessao)
                .ThenInclude(s => s!.Sala)
            .Include(i => i.Usuario)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id);

        if (ingresso is null) return NotFound();

        var res = new IngressoDTO
        {
            Id = ingresso.Id,
            Poltrona = ingresso.Poltrona,
            DataCompra = ingresso.DataCompra,
            SessaoId = ingresso.SessaoId,
            SessaoDataHora = ingresso.Sessao!.DataHora,
            SessaoPreco = ingresso.Sessao!.Preco,
            FilmeTitulo = ingresso.Sessao!.Filme!.Titulo,
            SalaNumero = ingresso.Sessao!.Sala!.Numero,
            UsuarioId = ingresso.UsuarioId,
            UsuarioEmail = ingresso.Usuario!.Email
        };

        return Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<IngressoDTO>> CreateAsync(CreateIngressoDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var sessaoExiste = await _context.Sessoes.AnyAsync(s => s.Id == dto.SessaoId);
        if (!sessaoExiste) return BadRequest(new { message = "Sessão não encontrada." });

        var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.Id == dto.UsuarioId);
        if (!usuarioExiste) return BadRequest(new { message = "Usuário não encontrado." });

        var poltronaOcupada = await _context.Ingressos
            .AnyAsync(i => i.SessaoId == dto.SessaoId && i.Poltrona == dto.Poltrona);
        if (poltronaOcupada)
            return BadRequest(new { message = "Essa poltrona já está ocupada nesta sessão." });

        var ingresso = new Ingresso
        {
            Poltrona = dto.Poltrona,
            DataCompra = DateTime.Now,
            SessaoId = dto.SessaoId,
            UsuarioId = dto.UsuarioId
        };

        _context.Ingressos.Add(ingresso);
        await _context.SaveChangesAsync();

        return CreatedAtRoute("GetIngressoById", new { id = ingresso.Id }, new { id = ingresso.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, UpdateIngressoDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var ingresso = await _context.Ingressos.FirstOrDefaultAsync(i => i.Id == id);
        if (ingresso is null) return NotFound();

        var poltronaOcupada = await _context.Ingressos
            .AnyAsync(i => i.SessaoId == ingresso.SessaoId && i.Poltrona == dto.Poltrona && i.Id != id);
        if (poltronaOcupada)
            return BadRequest(new { message = "Essa poltrona já está ocupada nesta sessão." });

        ingresso.Poltrona = dto.Poltrona;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var ingresso = await _context.Ingressos.FindAsync(id);
        if (ingresso is null) return NotFound();

        _context.Ingressos.Remove(ingresso);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}