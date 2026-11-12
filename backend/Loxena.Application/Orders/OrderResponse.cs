namespace Loxena.Application.Orders;

public record OrderItemResponse(
    Guid Id,
    Guid ProductId,
    int Quantity,
    int PickedQuantity,
    decimal UnitPrice,
    string? ProductName = null);

public record OrderResponse(
    Guid Id,
    Guid CustomerId,
    DateTime CreatedAt,
    string Status,
    decimal TotalAmount,
    List<OrderItemResponse> Items);

public record OrderSummaryResponse(
    Guid Id,
    Guid CustomerId,
    string CustomerName,
    DateTime CreatedAt,
    string Status,
    decimal TotalAmount,
    int ItemCount);
