
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit2, RefreshCw } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';
import { updateOrderStatus } from '../../services/orderApi';
import type { OrderStatus } from '../../types/order';
import OrderStatusBadge from '../../components/shared/OrderStatusBadge';
import OrderItemsTable from '../../components/orders/OrderItemsTable';
import OrderSummary from '../../components/orders/OrderSummary';
import AccessDenied from '../../components/shared/AccessDenied';
import { PageHeader } from '../../components/layout/PageHeader';

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, error, refetch } = useOrder(Number(id));
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !order) return;
    
    if (!window.confirm(`Are you sure you want to update the order status to "${selectedStatus}"?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, selectedStatus);
      await refetch();
      setSelectedStatus('');
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    if (error.response?.status === 404) return <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100">Order not found</div>;
    if (error.response?.status === 403) return <AccessDenied />;
    if (error.response?.status === 401) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">Your session has expired. Please log in again.</div>;
    return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">Error: {error.message}</div>;
  }

  if (!order) return <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100">Order not found</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order #${order.order_number}`}
        breadcrumbs={[
          { label: 'Orders', path: '/orders' },
          { label: order.order_number },
        ]}
        actions={
          (order.status === 'pending' || order.status === 'confirmed') && (
            <Link
              to={`/orders/${order.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 !text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit Order
            </Link>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
            <OrderItemsTable items={order.items} />
          </div>

          {order.notes && (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
              <span className="text-sm font-medium text-gray-500">Current Status</span>
              <OrderStatusBadge status={order.status} />
            </div>
            
            {/* Status Update Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Update Status
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select status...</option>
                  {ORDER_STATUSES.filter(s => s.value !== order.status).map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus || isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isUpdating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Update
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</span>
                <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</span>
                <p className="text-sm font-medium text-gray-900">{order.customer_phone}</p>
              </div>
              {order.customer_email && (
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                  <p className="text-sm font-medium text-gray-900">{order.customer_email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <OrderSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
