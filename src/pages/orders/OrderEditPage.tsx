
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrder';
import { updateOrder } from '../../services/orderApi';
import OrderForm from '../../components/orders/OrderForm';
import AccessDenied from '../../components/shared/AccessDenied';
import { PageHeader } from '../../components/layout/PageHeader';

const OrderEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, error } = useOrder(Number(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<any>(null);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const updatedOrder = await updateOrder(Number(id), data);
      navigate(`/orders/${updatedOrder.id}`);
    } catch (err: any) {
      if (err.response?.status === 422) {
        setSubmitError(err.response.data.errors);
      } else {
        setSubmitError(err);
      }
    } finally {
      setIsSubmitting(false);
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

  if (order.status !== 'pending' && order.status !== 'confirmed') {
    return (
      <div className="p-8 text-center space-y-4 bg-orange-50 rounded-xl border border-orange-100">
        <h2 className="text-xl font-bold text-orange-900">Cannot Edit Order</h2>
        <p className="text-orange-800 font-medium">This order cannot be edited because its status is currently <span className="font-bold uppercase tracking-wide">{order.status}</span>.</p>
        <button 
          onClick={() => navigate(`/orders/${order.id}`)}
          className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
        >
          Return to Details
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Order"
        breadcrumbs={[
          { label: 'Orders', path: '/orders' },
          { label: order.order_number, path: `/orders/${order.id}` },
          { label: 'Edit' },
        ]}
      />

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-4xl">
        {submitError && typeof submitError === 'string' && (
          <div className="mb-6 p-4 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
            {submitError}
          </div>
        )}
        <OrderForm order={order} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default OrderEditPage;
