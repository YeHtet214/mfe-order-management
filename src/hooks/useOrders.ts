
import { useState, useEffect, useCallback } from 'react';
import { getOrders, type PaginatedOrders } from '../services/orderApi';

export const useOrders = (params: { [key: string]: any }) => {
  const [orders, setOrders] = useState<PaginatedOrders | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders(params);
      setOrders(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => console.log("Fetched orders: ", orders), [orders]);

  return { orders, loading, error, refetch: fetchOrders };
};
