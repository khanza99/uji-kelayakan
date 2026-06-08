import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useConfirmPayment } from '@/hooks/useOrders';
import Table from '@/components/ui/Table';
import { PageSpinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { STORAGE_URL } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function ManageOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useOrders({ page, search, sort_by: 'created_at', sort_order: 'desc' });
  const confirmPaymentMutation = useConfirmPayment();

  const handleApprovePayment = async (order) => {
    if (window.confirm(`Approve payment for order ${order.order_code}?`)) {
      try {
        await confirmPaymentMutation.mutateAsync({ orderId: order.id, data: { action: 'approve' } });
        toast.success(`Payment approved for ${order.order_code}`);
      } catch (err) {
        toast.error('Failed to approve payment');
      }
    }
  };

  if (isLoading) return <PageSpinner />;

  const columns = [
    { key: 'order_code', label: 'Order Code', render: (val) => <span className="font-mono text-sm">{val}</span> },
    // { key: 'user_id', label: 'User', render: (_, row) => <span>{row.user?.name}</span> },
    { key: 'created_at', label: 'Date', render: (val) => formatDateTime(val) },
    { key: 'total_amount', label: 'Amount', render: (val) => <span className="font-semibold text-accent-400">{formatCurrency(val)}</span> },
    { key: 'status', label: 'Status', render: (val) => <OrderStatusBadge status={val} /> },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, row) => {
        // Find the latest pending payment for this order if it exists
        // (Assuming backend simplifies this, or we just look at order status)
        const isPending = row.status === 'pending' || row.payments?.some(p => p.status === 'pending');
        const proofPath = row.payments?.find(p => p.payment_proof_path)?.payment_proof_path;

        return (
          <div className="flex items-center gap-2">
            {proofPath && (
              <a 
                href={`${STORAGE_URL}/${proofPath}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-primary-400 hover:underline text-xs"
              >
                View Proof
              </a>
            )}
            {isPending && (
              <Button 
                size="xs" 
                variant="success" 
                onClick={() => handleApprovePayment(row)}
                loading={confirmPaymentMutation.isPending}
              >
                Approve
              </Button>
            )}
          </div>
        );
      } 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-black">Manage Orders</h1>
          <p className="text-surface-400 text-sm mt-1">Review and approve customer orders.</p>
        </div>
        <div className="w-full sm:w-64">
          <SearchInput 
            value={search} 
            onChange={setSearch} 
            onClear={() => setSearch('')}
            placeholder="Search order code..." 
          />
        </div>
      </div>

      <div className="glass rounded-xl p-4 border border-surface-800">
        <Table columns={columns} data={data?.data || []} />
        <div className="mt-4">
          <Pagination meta={data?.meta} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
