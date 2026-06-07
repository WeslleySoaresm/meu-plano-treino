using System.Reflection;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting; 

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. CONFIGURAÇÃO DOS SERVIÇOS (CONTAINER)
// ==========================================

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Configuração do CORS (Libera o React para acessar a API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.AllowAnyOrigin()   // Permite requisições de qualquer lugar (útil no desenvolvimento/Render)
              .AllowAnyMethod()   // Permite GET, POST, PUT, DELETE
              .AllowAnyHeader();  // Permite qualquer cabeçalho HTTP
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API do Plano de Treino 50 Semanas",
        Description = "Backend em .NET para gerenciamento e registro de planilhas de corrida e força sincronizadas com o Garmin."
    });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

// ==========================================
// 2. CONFIGURAÇÃO DO FLUXO DE EXECUÇÃO (MIDDLEWARE)
// ==========================================
var app = builder.Build();

// Aplica as migrations automaticamente na inicialização da API
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        // Executa a migração de forma síncrona ou aguarda a task corretamente no escopo principal
        context.Database.Migrate(); 
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao aplicar as migrações/criar o banco: {ex.Message}");
    }
}

// 🔓 CORREÇÃO PARA PRODUÇÃO: Swagger ativado globalmente (removido o IF de Development)
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    options.RoutePrefix = "swagger"; // Define a rota /swagger explicitamente
});

// Ativa o Middleware do CORS antes dos outros mapeamentos importantes
app.UseCors("AllowReact");

app.UseAuthorization();
app.MapControllers();

app.Run();