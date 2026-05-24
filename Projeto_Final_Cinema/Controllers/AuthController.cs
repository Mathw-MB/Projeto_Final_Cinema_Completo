using CinemaApi.Data;
using CinemaApi.DTOs;
using CinemaApi.Models;
using CinemaApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinemaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Validação de email duplicado
        var emailExiste = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
        if (emailExiste)
            return BadRequest(new { message = "Este e-mail já está cadastrado." });

        var senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

        var usuario = new Usuario
        {
            Email = dto.Email,
            Senha = senhaHash
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Usuário cadastrado com sucesso." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var user = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, user.Senha))
            return Unauthorized(new { message = "E-mail ou senha inválidos." });

        var token = _tokenService.GenerateToken(user.Email);

       
        return Ok(new { token, email = user.Email });
    }
}