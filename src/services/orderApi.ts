
import api from './api';
import { type Order, type OrderStatus } from '../types/order';

export interface PaginatedOrders {
  data: Order[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export const getOrders = async (params: { [key: string]: any }): Promise<PaginatedOrders> => {
  const response = await api.get('/api/orders', { params });
  console.log("Response data: ", response);
  return response.data;
};

export const createOrder = async (data: { [key: string]: any }): Promise<Order> => {
  const response = await api.post('/api/orders', data);
  return response.data.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await api.get(`/api/orders/${id}`);
  return response.data.data;
};

export const updateOrder = async (id: number, data: { [key: string]: any }): Promise<Order> => {
  const response = await api.put(`/api/orders/${id}`, data);
  return response.data.data;
};

export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order> => {
  const response = await api.patch(`/api/orders/${id}/status`, { status });
  return response.data.data;
};
