namespace Loxena.Application.Customers.UpdateCustomer;

public record UpdateCustomerRequest(
    string Name,
    string Email,
    string Document,
    string Phone
);

