namespace Loxena.Application.Orders;

public record OrderItemResponse(
    Guid Id,
    Guid ProductId,
    int Quantity,
    decimal UnitPrice);

public record OrderResponse(
    Guid Id,
    Guid CustomerId,
    DateTime CreatedAt,
    string Status,
    decimal TotalAmount,
    List<OrderItemResponse> Items);
