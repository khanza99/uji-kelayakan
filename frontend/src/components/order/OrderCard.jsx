import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrderCard({ order, onClick }) {
  return (
    <button
      onClick={() => onClick?.(order)}
      className="w-full text-left p-4 rounded-xl bg-surface-900/80 border border-surface-800 hover:border-surface-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary-900/5"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-white font-mono">{order.order_code}</p>
          <p className="text-xs text-surface-500 mt-0.5">{formatDateTime(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-surface-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          {order.items?.length || 0} ticket{(order.items?.length || 0) !== 1 ? 's' : ''}
        </div>
        <p className="text-sm font-bold text-white">{formatCurrency(order.total_amount)}</p>
      </div>
    </button>
  );
}
