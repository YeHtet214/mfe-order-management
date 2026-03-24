
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orderApi';
import OrderForm from '../../components/orders/OrderForm';
import { PageHeader } from '../../components/layout/PageHeader';

const OrderCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newOrder = await createOrder(data);
      navigate(`/orders/${newOrder.id}`);
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError(err.response.data.errors);
      } else {
        setError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Order"
        breadcrumbs={[
          { label: 'Orders', path: '/orders' },
          { label: 'Create Order' },
        ]}
      />

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-4xl">
        {error && typeof error === 'string' && (
          <div className="mb-6 p-4 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        <OrderForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default OrderCreatePage;
