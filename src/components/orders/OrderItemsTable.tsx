
import React from 'react';
import { type OrderItem } from '../../types/order';

interface OrderItemsTableProps {
  items: OrderItem[];
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Unit Price</th>
          <th>Quantity</th>
          <th>Line Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.product_name}</td>
            <td>{item.product_sku}</td>
            <td>{item.unit_price}</td>
            <td>{item.quantity}</td>
            <td>{item.line_total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderItemsTable;
