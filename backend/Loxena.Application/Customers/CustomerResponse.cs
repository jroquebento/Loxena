namespace Loxena.Application.Customers;

public record CustomerResponse(
    Guid Id,
    string Name,
    string Email,
    string Document,
    string Phone,
    bool IsActive
);

