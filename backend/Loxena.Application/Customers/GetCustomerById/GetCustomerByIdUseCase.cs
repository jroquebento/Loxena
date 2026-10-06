using Loxena.Application.Interfaces;
using Mapster;

namespace Loxena.Application.Customers.GetCustomerById;

public class GetCustomerByIdUseCase
{
    private readonly ICustomerRepository _customerRepository;
    public GetCustomerByIdUseCase(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<CustomerResponse?> ExecuteAsync(Guid id) 
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer is null)
            throw new InvalidOperationException("Cliente não encontrado.");

        return customer.Adapt<CustomerResponse>();
    }
}
