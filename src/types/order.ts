
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string | null;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
  status: OrderStatus;
  subtotal: string;
  total: string;
  items: OrderItem[];
  creator: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}
