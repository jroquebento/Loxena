namespace Loxena.Application.Orders.CreateOrder;

public record CreateOrdemItemRequest(Guid ProductId, int Quantity);
public record CreateOrderRequest(Guid CustomerId, List<CreateOrdemItemRequest> Items);
