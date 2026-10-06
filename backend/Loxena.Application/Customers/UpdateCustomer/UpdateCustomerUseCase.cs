using Loxena.Application.Interfaces;
using Mapster;

namespace Loxena.Application.Customers.UpdateCustomer;

public class UpdateCustomerUseCase
{
    private readonly ICustomerRepository _customerRepository;

    public UpdateCustomerUseCase(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<CustomerResponse> ExecuteAsync(UpdateCustomerRequest request, Guid id) 
    {
        var emailExists = await _customerRepository.ExistsByEmailAsync(request.Email, id);
        if(emailExists)
            throw new InvalidOperationException("Já existe outro cliente cadastrado com este e-mail.");

        var documentExists = await _customerRepository.ExistsByDocumentAsync(request.Document, id);
        if (documentExists)
            throw new InvalidOperationException("Já existe outro cliente cadastrado com este documento.");

        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer is null)
            throw new InvalidOperationException("Cliente não encontrado.");

        customer.Update(
            request.Name,
            request.Email,
            request.Document,
            request.Phone
        );

        await _customerRepository.UpdateAsync(customer);
        
        return customer.Adapt<CustomerResponse>();
    }
}
