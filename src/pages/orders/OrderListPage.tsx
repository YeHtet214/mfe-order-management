
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2 } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import OrderStatusBadge from '../../components/shared/OrderStatusBadge';
import AccessDenied from '../../components/shared/AccessDenied';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { SearchInput } from '../../components/shared/SearchInput';
import { useAuth } from '../../contexts/AuthContext';
import { type Order } from '../../types/order';

const OrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  
  const params = useMemo(() => (!search && !status ? {} : { search, status }), [search, status]);
  const { orders, loading, error } = useOrders(params);

  const columns = [
    {
      header: 'Order Number',
      accessor: 'order_number' as keyof Order,
      className: 'font-medium text-blue-600',
    },
    {
      header: 'Customer',
      accessor: 'customer_name' as keyof Order,
    },
    {
      header: 'Status',
      accessor: (order: Order) => <OrderStatusBadge status={order.status} />,
    },
    {
      header: 'Total',
      accessor: (order: Order) => `$${order.total}`,
      className: 'font-semibold',
    },
    {
      header: 'Created At',
      accessor: (order: Order) => new Date(order.created_at).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: (order: Order) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/orders/${order.id}`}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {(order.status === 'pending' || order.status === 'confirmed') && (
            <Link
              to={`/orders/${order.id}/edit`}
              className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
              title="Edit Order"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    if (error.response?.status === 403) return <AccessDenied />;
    if (error.response?.status === 401) return <div className="p-8 text-center text-red-500 font-medium bg-red-50 rounded-xl border border-red-100">Your session has expired. Please log in again.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage customer orders and track their status"
        actions={
          hasPermission('orders.create') && (
            <Link
              to="/orders/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 !text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Order
            </Link>
          )
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <SearchInput
          placeholder="Search by number, name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={orders?.data || []}
        isLoading={loading}
        error={error?.message}
        onRowClick={(order) => navigate(`/orders/${order.id}`)}
      />
      
      {/* Pagination component can be added here if available */}
    </div>
  );
};

export default OrderListPage;
