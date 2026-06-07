using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;

namespace Domain.entities
{
    public class Person
    {
        [Key] //indica que a propriedade Id é a chave primária da entidade
        public Guid Id { get; set; }  //id do tipo guid, para ser gerado automaticamente, e não pode ser nulo {do usuario}

        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string Name { get; set; } //nome do usuario
        
        [Required(ErrorMessage = "O email é obrigatório.")]
        [EmailAddress(ErrorMessage = "Formato de email inválido.")]
        public string Email { get; set; } //email do usuario

        public string Phone { get; set; } //telefone do usuario

        [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
        public DateTime DataNascimento { get; set; } //data de nascimento do usuario
        
        [Required(ErrorMessage = "O Peso é obrigatório.")]
        public float Weight { get; set; }//peso do usuario
        
        [Required(ErrorMessage = "A Altura é obrigatória.")]
        public float Height { get; set; } //altura do usuario

        [Required(ErrorMessage = "A atividade física é obrigatória.")]
        public bool EngageInPhysicalActivity { get; set; } //se o usuario ja praticou atividade fisica

        public string PhysicalActivity { get; set; } //atividade fisica praticada

        [Column("PasswordHash")]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        // RELAÇÃO INVERSA: Uma pessoa tem uma lista de Planos associados a ela
        public List<Plane> Planes { get; set; } = new List<Plane>();

        public Person() { } //classe base para representar uma pessoa, com propriedades comuns a todas as pessoas, como id, nome, email, telefone, data de nascimento, peso, altura, se pratica atividade fisica e qual atividade fisica pratica
        
        //Construtor para criar uma nova instância da classe PersonModel
        public Person(string name, string email, string phone, DateTime dataNascimento, float weight, float height, bool engageInPhysicalActivity, string passwordHash, string physicalActivity)
        {
            Id = Guid.NewGuid(); //gerar um novo id automaticamente
            Name = name;
            Email = email;
            Phone = phone;
            DataNascimento = dataNascimento;
            Weight = weight;
            Height = height;
            EngageInPhysicalActivity = engageInPhysicalActivity;
            this.PasswordHash = passwordHash; //usar o parâmetro para inicializar a senha (ajustado com 'this.' para diferenciar da propriedade)
            PhysicalActivity = physicalActivity;    
        }
    }
}