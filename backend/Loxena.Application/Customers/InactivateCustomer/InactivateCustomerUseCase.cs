using Loxena.Application.Interfaces;

namespace Loxena.Application.Customers.InactivateCustomer;

public class InactivateCustomerUseCase
{
    private readonly ICustomerRepository _customerRepository;

    public InactivateCustomerUseCase(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id)
    {

        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer is null)
            return false;

        if (customer.IsActive)
        {
            customer.Inactivate();
            await _customerRepository.UpdateAsync(customer);
        }

        return true;
    }
}
