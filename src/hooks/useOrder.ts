import { useState, useEffect, useCallback } from 'react';
import { getOrder } from '../services/orderApi';
import { type Order } from '../types/order';

export const useOrder = (id: number) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
};
