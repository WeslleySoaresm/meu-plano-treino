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

// CORREÇÃO: Mapeia os controladores e impede o loop infinito de referências circulares no JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.WebHost.UseUrls("http://localhost:5000");

// Puxa a string de conexão do PostgreSQL que colocamos no appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configura o Banco de Dados para usar o PostgreSQL real
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configura o motor de documentação do Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API do Plano de Treino 50 Semanas",
        Description = "Backend em .NET para gerenciamento e registro de planilhas de corrida e força sincronizadas com o Garmin."
    });

    // Lê os comentários de três barras (///) dos controladores para exibir no Swagger
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

// AJUSTE: Aplica as migrations automaticamente na inicialização da API
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync(); 
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao aplicar as migrações/criar o banco: {ex.Message}");
    }
}

// Ativa o Swagger se o projeto estiver rodando em ambiente de desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    });
}

// Configurações básicas de segurança e roteamento
app.UseAuthorization();

// Mapeia as rotas dos nossos controladores para que fiquem acessíveis por URLs
app.MapControllers();

// Liga o servidor e faz a API começar a escutar as requisições
app.Run();