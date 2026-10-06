using Loxena.Application.Customers.CreateCustomer;
using Loxena.Application.Customers.GetCustomerById;
using Loxena.Application.Customers.GetCustomers;
using Loxena.Application.Customers.InactivateCustomer;
using Loxena.Application.Customers.UpdateCustomer;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class CustomersController : ControllerBase
{
    private readonly CreateCustomerUseCase _createCustomerUseCase;
    private readonly GetCustomerByIdUseCase _getCustomerByIdUseCase;
    private readonly GetCustomersUseCase _getCustomersUseCase;
    private readonly InactivateCustomerUseCase _inactivateCustomerUseCase;
    private readonly UpdateCustomerUseCase _updateCustomerUseCase;

    public CustomersController(
        CreateCustomerUseCase createCustomerUseCase,
        GetCustomerByIdUseCase getCustomerByIdUseCase,
        GetCustomersUseCase getCustomersUseCase,
        InactivateCustomerUseCase inactivateCustomerUseCase,
        UpdateCustomerUseCase updateCustomerUseCase)
    {
        _createCustomerUseCase = createCustomerUseCase;
        _getCustomerByIdUseCase = getCustomerByIdUseCase;
        _getCustomersUseCase = getCustomersUseCase;
        _inactivateCustomerUseCase = inactivateCustomerUseCase;
        _updateCustomerUseCase = updateCustomerUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCustomerRequest request) 
    {
        var customer = await _createCustomerUseCase.ExecuteAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var customer = await _getCustomerByIdUseCase.ExecuteAsync(id);
       
        return Ok(customer);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var customers = await _getCustomersUseCase.ExecuteAsync();
        return Ok(customers);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateCustomerRequest request)
    {
        var customer = await _updateCustomerUseCase.ExecuteAsync(request, id);
   
        return Ok(customer);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _inactivateCustomerUseCase.ExecuteAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}
