import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import OrderCard from '@/components/order/OrderCard';
import { PageSpinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ page, sort_by: 'created_at', sort_order: 'desc' });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-black">My Orders</h1>
        <p className="text-surface-400 text-sm mt-1">Track and manage your concert ticket orders.</p>
      </div>

      {!data?.data?.length ? (
        <div className="glass rounded-2xl border border-surface-800">
          <EmptyState
            title="No orders found"
            description="You haven't placed any orders yet."
            action={
              <button
                onClick={() => navigate('/concerts')}
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Browse Concerts →
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={(o) => navigate(`/my-orders/${o.id}`)}
            />
          ))}

          <div className="pt-4">
            <Pagination
              meta={data?.meta || data}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
