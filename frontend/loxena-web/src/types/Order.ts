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
}

export interface Order {
  id: string;
  customerId: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
}