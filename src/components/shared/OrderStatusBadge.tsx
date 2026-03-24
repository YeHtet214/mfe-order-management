
import React from 'react';
import { type OrderStatus } from '../../types/order';
import { cn } from '../../lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: { [key in OrderStatus]: string } = {
  pending: 'bg-gray-200 text-gray-800',
  confirmed: 'bg-blue-200 text-blue-800',
  processing: 'bg-orange-200 text-orange-800',
  completed: 'bg-green-200 text-green-800',
  cancelled: 'bg-red-200 text-red-800',
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
};

export default OrderStatusBadge;
