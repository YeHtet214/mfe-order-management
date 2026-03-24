
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Package } from 'lucide-react';
import { type Order } from '../../types/order';
import { fetchProducts } from '../../services/productApi';
import { type Product } from '../../services/types';
import { cn } from '../../lib/utils';

const orderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_phone: z.string().min(1, 'Customer phone is required'),
  customer_email: z.string().email('Invalid email address').nullable().or(z.literal('')),
  notes: z.string().nullable().or(z.literal('')),
  items: z.array(z.object({
    product_id: z.number().min(1, 'Please select a product'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    _price: z.number().optional(), // Internal only for UI calculation
    _name: z.string().optional(), // Internal only for UI
  })).min(1, 'At least one item is required'),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onSubmit, isSubmitting }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: order ? {
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email || '',
      notes: order.notes || '',
      items: order.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        _price: Number(item.unit_price),
        _name: item.product_name,
      }))
    } : {
      items: [{ product_id: 0, quantity: 1 }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchedItems = watch("items");

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetchProducts({ per_page: 100 });
        setProducts(response.data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const calculateSubtotal = () => {
    return watchedItems.reduce((acc, item) => {
      const price = item._price || 0;
      return acc + (price * item.quantity);
    }, 0);
  };

  const handleProductChange = (index: number, productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}._price`, Number(product.base_price));
      setValue(`items.${index}._name`, product.name);
    }
  };

  const onFormSubmit = (values: OrderFormValues) => {
    // Strip out internal fields before submitting
    const payload = {
      ...values,
      items: values.items.map(({ product_id, quantity }) => ({ product_id, quantity }))
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Customer Name *</label>
            <input
              {...register("customer_name")}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                errors.customer_name ? "border-red-500 bg-red-50" : "border-gray-300"
              )}
              placeholder="Full name"
            />
            {errors.customer_name && <p className="text-xs text-red-500 font-medium">{errors.customer_name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Customer Phone *</label>
            <input
              {...register("customer_phone")}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                errors.customer_phone ? "border-red-500 bg-red-50" : "border-gray-300"
              )}
              placeholder="Phone number"
            />
            {errors.customer_phone && <p className="text-xs text-red-500 font-medium">{errors.customer_phone.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Customer Email</label>
            <input
              {...register("customer_email")}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                errors.customer_email ? "border-red-500 bg-red-50" : "border-gray-300"
              )}
              placeholder="email@example.com"
            />
            {errors.customer_email && <p className="text-xs text-red-500 font-medium">{errors.customer_email.message}</p>}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
          <button
            type="button"
            onClick={() => append({ product_id: 0, quantity: 1 })}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {errors.items?.root && (
          <p className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100 font-medium">
            {errors.items.root.message}
          </p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product</label>
                <select
                  {...register(`items.${index}.product_id` as const, { valueAsNumber: true })}
                  onChange={(e) => handleProductChange(index, Number(e.target.value))}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm",
                    errors.items?.[index]?.product_id ? "border-red-500" : "border-gray-300"
                  )}
                  disabled={loadingProducts}
                >
                  <option value={0}>Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ${p.base_price}</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-24 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</label>
                <input
                  type="number"
                  {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm",
                    errors.items?.[index]?.quantity ? "border-red-500" : "border-gray-300"
                  )}
                  min={1}
                />
              </div>

              <div className="w-full sm:w-32 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price</label>
                <div className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg">
                  ${watchedItems[index]?._price || 0}
                </div>
              </div>

              <div className="w-full sm:w-32 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total</label>
                <div className="px-3 py-2 text-sm font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg">
                  ${((watchedItems[index]?._price || 0) * (watchedItems[index]?.quantity || 0)).toFixed(2)}
                </div>
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute -top-2 -right-2 sm:static sm:mt-6 p-1.5 text-gray-400 hover:text-red-600 transition-colors bg-white sm:bg-transparent rounded-full shadow-sm sm:shadow-none border border-gray-100 sm:border-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700">Order Notes</label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Any special instructions..."
        />
      </div>

      {/* Footer / Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t">
        <div className="text-center sm:text-left">
          <span className="text-sm font-medium text-gray-500">Estimated Total</span>
          <p className="text-3xl font-black text-gray-900">${calculateSubtotal().toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Final total will be calculated by the server</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Package className="w-5 h-5" />
            )}
            {order ? 'Update Order' : 'Create Order'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OrderForm;
