import { useState } from 'react';
import { usePayments } from '@/hooks/usePayments';
import Table from '@/components/ui/Table';
import { PageSpinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import PaymentStatusBadge from '@/components/payment/PaymentStatusBadge';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { STORAGE_URL } from '@/utils/constants';

export default function MyPaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePayments({ page, sort_by: 'created_at', sort_order: 'desc' });

  if (isLoading) return <PageSpinner />;

  const columns = [
    {
      key: 'created_at',
      label: 'Date',
      render: (val) => formatDateTime(val),
    },
    {
      key: 'order_code',
      label: 'Order Code',
      render: (_, row) => <span className="font-mono">{row.order?.order_code || '-'}</span>,
    },
    {
      key: 'payment_method',
      label: 'Method',
      render: (val) => <span className="capitalize">{val?.replace('_', ' ')}</span>,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (val) => <span className="font-semibold text-accent-400">{formatCurrency(val)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <PaymentStatusBadge status={val} />,
    },
    {
      key: 'proof',
      label: 'Proof',
      render: (_, row) =>
        row.payment_proof_path ? (
          <a
            href={`${STORAGE_URL}/${row.payment_proof_path}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary-400 hover:underline text-sm"
          >
            View
          </a>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-black">Payment History</h1>
        <p className="text-surface-400 text-sm mt-1">A record of all your payment transactions.</p>
      </div>

      <div className="glass rounded-xl p-4 border border-surface-800">
        <Table columns={columns} data={data?.data || []} />
        <div className="mt-4">
          <Pagination meta={data?.meta || data} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
