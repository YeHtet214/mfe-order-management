
import React from 'react';
import { type Order } from '../../types/order';

interface OrderSummaryProps {
  order: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  return (
    <div>
      <div>
        <span>Subtotal:</span>
        <span>{order.subtotal}</span>
      </div>
      <div>
        <span>Total:</span>
        <span>{order.total}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
