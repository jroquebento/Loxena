namespace Loxena.Domain.Entities;

public class Customer
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Document { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }

    private Customer() {  }

    public Customer(string name, string email, string document, string phone)
    {
        Validade(name, email, document, phone);

        Id = Guid.NewGuid();
        Name = name.Trim();
        Email = email.Trim().ToLower();
        Document = document.Trim();
        Phone = phone.Trim();
        IsActive = true;
    }

    public void Update(string name, string email, string document, string phone)
    {
        Validade(name, email, document, phone);

        Name = name.Trim();
        Email = email.Trim().ToLower();
        Document = document.Trim();
        Phone = phone.Trim();
    }

    private static void Validade(string name, string email, string document, string phone)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("O nome é obrigatório.");

        if (name.Trim().Length > 200)
            throw new ArgumentException("O nome não pode exceder 200 caracteres.");

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("O e-mail é obrigatório.");

        if (!email.Contains('@') || email.Trim().Length > 150)
            throw new ArgumentException("Informe um e-mail válido com no máximo 150 caracteres");

        if (string.IsNullOrWhiteSpace(document))
            throw new ArgumentException("O documento (CPF/CNPJ) é obrigatório.");

        if (document.Trim().Length > 20)

            throw new ArgumentException("O documento não pode exceder 20 caracteres.");

        if (string.IsNullOrWhiteSpace(phone))
            throw new ArgumentException("O telefone é obrigatório.");

        if (phone.Trim().Length > 20)
            throw new ArgumentException("O telefone não pode exceder 20 caracteres.");
    }

    public void Inactivate()
    {
        if (!IsActive)
            throw new InvalidOperationException("O cliente já está inativo.");

        IsActive = false;
    }
}
