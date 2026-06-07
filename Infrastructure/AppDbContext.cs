using Microsoft.EntityFrameworkCore;
using Domain.entities;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Definição das Tabelas no Banco de Dados
        public DbSet<Person> Persons { get; set; }
        public DbSet<Plane> Planes { get; set; }
        public DbSet<WeekTemplate> WeekTemplates { get; set; }
        public DbSet<PlaneDay> PlaneDays { get; set; }
        public DbSet<TrainingData> TrainingRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Define o schema padrão para todo o contexto
            modelBuilder.HasDefaultSchema("TreinoSemanais");
            
            // 1. Configuração da Entidade Person
            modelBuilder.Entity<Person>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired();
                entity.Property(p => p.Email).IsRequired();
            });

            // 2. Configuração da Entidade Plane (Relação 1-para-Muitos com Person)
            modelBuilder.Entity<Plane>(entity =>
            {
                entity.HasKey(pl => pl.Id);
                
                entity.HasOne(pl => pl.Person)
                      .WithMany(pe => pe.Planes)
                      .HasForeignKey(pl => pl.PersonId)
                      .OnDelete(DeleteBehavior.Cascade); // Se apagar o usuário, apaga os planos dele
            });

            // 3. Configuração da Entidade WeekTemplate (Relação 1-para-Muitos com Plane)
            modelBuilder.Entity<WeekTemplate>(entity =>
            {
                entity.HasKey(w => w.Id);

                entity.HasOne(w => w.Plane)
                      .WithMany(pl => pl.WeeksStructure)
                      .HasForeignKey(w => w.PlaneId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // 4. Configuração da Entidade PlaneDay (Relação 1-para-Muitos com WeekTemplate)
            modelBuilder.Entity<PlaneDay>(entity =>
            {
                entity.HasKey(d => d.Id);

                entity.HasOne(d => d.WeekTemplate)
                      .WithMany(w => w.Days)
                      .HasForeignKey(d => d.WeekTemplateId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Configura a lista de strings (Content) para ser salva adequadamente se necessário, 
                // ou assume que o ContentRaw (\n) resolve o problema de forma nativa.
            });

            // 5. Configuração da Entidade TrainingData (Relação 1-para-Muitos com Plane)
            modelBuilder.Entity<TrainingData>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.HasOne(t => t.Plane)
                      .WithMany(pl => pl.Training)
                      .HasForeignKey(t => t.PlaneId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}