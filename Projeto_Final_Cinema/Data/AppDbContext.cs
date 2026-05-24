using Microsoft.EntityFrameworkCore;
using CinemaApi.Models;

namespace CinemaApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Filme> Filmes => Set<Filme>();
    public DbSet<Sala> Salas => Set<Sala>();
    public DbSet<Sessao> Sessoes => Set<Sessao>();
    public DbSet<Ingresso> Ingressos => Set<Ingresso>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Sessao>()
            .HasOne(s => s.Filme)
            .WithMany()
            .HasForeignKey(s => s.FilmeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Sessao>()
            .HasOne(s => s.Sala)
            .WithMany()
            .HasForeignKey(s => s.SalaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ingresso>()
            .HasOne(i => i.Sessao)
            .WithMany(s => s.Ingressos)
            .HasForeignKey(i => i.SessaoId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Ingresso>()
            .HasOne(i => i.Usuario)
            .WithMany()
            .HasForeignKey(i => i.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Sessao>(entity =>
        {
            entity.Property(s => s.Preco).HasPrecision(18, 2);
        });
    }
}