using Loxena.Application.Interfaces;
using Loxena.Domain.Entities;
using Mapster;

namespace Loxena.Application.Customers.CreateCustomer;

public class CreateCustomerUseCase
{
    private readonly ICustomerRepository _customerRepository;

    public CreateCustomerUseCase(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<CustomerResponse> ExecuteAsync(CreateCustomerRequest request) 
    {
        var emailExists = await _customerRepository.ExistsByEmailAsync(request.Email);
        if (emailExists)
            throw new InvalidOperationException("Já existe um cliente cadastrado com este e-mail.");

        var documentExists = await _customerRepository.ExistsByDocumentAsync(request.Document);
        if (documentExists)
            throw new InvalidOperationException("Já existe um cliente cadastrado com este documento.");

        var customer = new Customer(
            request.Name,
            request.Email,
            request.Document,
            request.Phone);

        await _customerRepository.AddAsync(customer);

        return customer.Adapt<CustomerResponse>();
    }
}
