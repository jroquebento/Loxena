using Loxena.Application.Interfaces;

namespace Loxena.Application.Customers.InactivateCustomer;

public class InactivateCustomerUseCase
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IOrderRepository _orderRepository;

    public InactivateCustomerUseCase(
        ICustomerRepository customerRepository,
        IOrderRepository orderRepository)
    {
        _customerRepository = customerRepository;
        _orderRepository = orderRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id)
    {

        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer is null)
            return false;

        if (customer.IsActive)
        {
            var hasActiveOrders = await _orderRepository.HasActiveOrdersByCustomerIdAsync(customer.Id);
            if (hasActiveOrders)
                throw new InvalidOperationException("Não é possível inativar um cliente que possui pedidos ativos.");

            customer.Inactivate();
            await _customerRepository.UpdateAsync(customer);
        }

        return true;
    }
}
