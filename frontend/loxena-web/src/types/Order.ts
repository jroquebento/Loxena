export type OrderStatus = 
  | 'Pending' 
  | 'Picking' 
  | 'Checking' 
  | 'Packing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Canceled';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  stockId: string;
  quantity: number;
  pickedQuantity: number;
  unitPrice: number;
  productName?: string;
}

export interface Order {
  id: string;
  customerId: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderSummary {
  id: string;
  customerId: string;
  customerName: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customerId: string;
  items: CreateOrderItemRequest[];
}