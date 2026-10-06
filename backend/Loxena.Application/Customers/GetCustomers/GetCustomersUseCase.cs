using Loxena.Application.Interfaces;
using Mapster;

namespace Loxena.Application.Customers.GetCustomers;

public class GetCustomersUseCase
{
    private readonly ICustomerRepository _customerRepository;
    public GetCustomersUseCase(ICustomerRepository customerRepository   )
    {
        _customerRepository = customerRepository;
    }

    public async Task<IReadOnlyList<CustomerResponse>> ExecuteAsync() 
    {
        var customers = await _customerRepository.GetAllAsync();
        return customers.Adapt<IReadOnlyList<CustomerResponse>>();
    }

}
