# Estágio 1: Build de todas as camadas usando o SDK do .NET 9.0
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

# Copia os arquivos de configuração de todas as camadas para restaurar as dependências
COPY Controllers/Controllers.csproj ./Controllers/
COPY Domain/Domain.csproj ./Domain/
COPY Dtos/Dtos.csproj ./Dtos/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/

# Restaura as dependências focando no projeto principal (Controllers)
RUN dotnet restore Controllers/Controllers.csproj

# Copia todo o resto do código-fonte para dentro do container
COPY . ./

# Compila e publica o projeto a partir da pasta Controllers
RUN dotnet publish Controllers/Controllers.csproj -c Release -o out

# Estágio 2: Criação da imagem de execução leve usando o Runtime do .NET 9.0
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /app/out .

EXPOSE 80
EXPOSE 443

# Comando para rodar a DLL gerada pelo projeto principal
ENTRYPOINT ["dotnet", "Controllers.dll"]