import { useState } from 'react';
import { useRefunds, useUpdateRefund } from '@/hooks/useRefunds';
import Table from '@/components/ui/Table';
import { PageSpinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import RefundStatusBadge from '@/components/refund/RefundStatusBadge';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import toast from 'react-hot-toast';

export default function ManageRefundsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useRefunds({ page, search, sort_by: 'created_at', sort_order: 'desc' });
  const updateRefundMutation = useUpdateRefund();

  const handleAction = async (id, status) => {
    if (window.confirm(`Are you sure you want to ${status} this refund request?`)) {
      try {
        await updateRefundMutation.mutateAsync({ id, data: { status } });
        toast.success(`Refund request ${status} successfully`);
      } catch (err) {
        toast.error(`Failed to ${status} refund request`);
      }
    }
  };

  if (isLoading) return <PageSpinner />;

  const columns = [
    { key: 'created_at', label: 'Date', render: (val) => formatDateTime(val) },
    // { key: 'user', label: 'User', render: (_, row) => <span>{row.user?.name}</span> },
    { key: 'ticket_code', label: 'Ticket', render: (_, row) => <span className="font-mono">{row.ticket?.ticket_code}</span> },
    { key: 'refund_amount', label: 'Amount', render: (val) => <span className="font-semibold text-accent-400">{formatCurrency(val)}</span> },
    { key: 'reason', label: 'Reason', render: (val) => <span className="text-xs truncate max-w-[150px] inline-block" title={val}>{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <RefundStatusBadge status={val} /> },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, row) => row.status === 'pending' ? (
        <div className="flex gap-2">
          <Button size="xs" variant="success" onClick={() => handleAction(row.id, 'approved')}>
            Approve
          </Button>
          <Button size="xs" variant="danger" outline onClick={() => handleAction(row.id, 'rejected')}>
            Reject
          </Button>
        </div>
      ) : '-'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-black">Manage Refunds</h1>
          <p className="text-surface-400 text-sm mt-1">Review customer refund requests.</p>
        </div>
        <div className="w-full sm:w-64">
          <SearchInput 
            value={search} 
            onChange={setSearch} 
            onClear={() => setSearch('')}
            placeholder="Search ticket code..." 
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
