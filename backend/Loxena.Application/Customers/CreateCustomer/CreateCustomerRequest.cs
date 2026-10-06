namespace Loxena.Application.Customers.CreateCustomer;

public record CreateCustomerRequest(
    string Name,
    string Email,
    string Document,
    string Phone
);

