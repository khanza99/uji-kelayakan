import { useDashboard } from '@/hooks/useDashboard';
import { PageSpinner } from '@/components/ui/Spinner';
import StatCard from '@/components/ui/StatCard';
import { formatCurrency } from '@/utils/formatCurrency';

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <PageSpinner />;

  const stats = data || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-black">Dashboard Overview</h1>
        <p className="text-surface-400 mt-1">Summary of platform performance and statistics.</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.total_revenue || 0)}
          icon={(p) => (
            <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />
        <StatCard
          title="Tickets Sold"
          value={stats.tickets_sold || 0}
          icon={(p) => (
            <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          )}
        />
        <StatCard
          title="Active Concerts"
          value={stats.active_concerts || 0}
          icon={(p) => (
            <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          )}
        />
        <StatCard
          title="Total Users"
          value={stats.total_users || 0}
          icon={(p) => (
            <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border border-surface-800">
          <h3 className="font-semibold text-black mb-4">Pending Orders</h3>
          <p className="text-3xl font-bold font-display text-warning-400 mb-2">
            {stats.pending_orders || 0}
          </p>
          <p className="text-sm text-surface-400">Orders waiting for payment confirmation</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-surface-800">
          <h3 className="font-semibold text-black mb-4">Pending Refunds</h3>
          <p className="text-3xl font-bold font-display text-danger-400 mb-2">
            {stats.pending_refunds || 0}
          </p>
          <p className="text-sm text-surface-400">Refund requests awaiting review</p>
        </div>
      </div>
    </div>
  );
}
