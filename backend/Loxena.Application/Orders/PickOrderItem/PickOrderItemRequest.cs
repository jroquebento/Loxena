namespace Loxena.Application.Orders.PickOrderItem;

public record PickOrderItemRequest(
    Guid OrderItemId,
    int Quantity
);