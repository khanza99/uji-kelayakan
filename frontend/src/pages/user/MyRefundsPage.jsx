import { useState } from 'react';
import { useRefunds, useCreateRefund } from '@/hooks/useRefunds';
import { useTickets } from '@/hooks/useTickets';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import TextArea from '@/components/ui/TextArea';
import { PageSpinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import RefundStatusBadge from '@/components/refund/RefundStatusBadge';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import toast from 'react-hot-toast';

export default function MyRefundsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRefunds({ page, sort_by: 'created_at', sort_order: 'desc' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New refund form state
  const { data: ticketsData } = useTickets({ status: 'active', limit: 50 }); // Fetch user's active tickets to request refund
  const createRefundMutation = useCreateRefund();
  const [form, setForm] = useState({ ticket_id: '', reason: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ticket_id || !form.reason) {
      return toast.error('Please fill in all fields');
    }
    try {
      await createRefundMutation.mutateAsync(form);
      toast.success('Refund request submitted successfully');
      setIsModalOpen(false);
      setForm({ ticket_id: '', reason: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit refund request');
    }
  };

  if (isLoading) return <PageSpinner />;

  const ticketOptions = (ticketsData?.data || []).map((t) => ({
    value: t.id,
    label: `${t.ticket_code} — ${t.order_item?.seat_tier?.concert?.title || 'Ticket'}`,
  }));

  const columns = [
    { key: 'created_at', label: 'Date', render: (val) => formatDateTime(val) },
    { key: 'ticket_code', label: 'Ticket Code', render: (_, row) => <span className="font-mono">{row.ticket?.ticket_code}</span> },
    { key: 'refund_amount', label: 'Amount', render: (val) => <span className="font-semibold text-accent-400">{formatCurrency(val)}</span> },
    { key: 'status', label: 'Status', render: (val) => <RefundStatusBadge status={val} /> },
    { key: 'reason', label: 'Reason', render: (val) => <span className="text-xs truncate max-w-[200px] inline-block">{val}</span> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-black">Refund Requests</h1>
          <p className="text-surface-400 text-sm mt-1">Manage your ticket cancellation and refund requests.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="accent">
          Request Refund
        </Button>
      </div>

      <div className="glass rounded-xl p-4 border border-surface-800">
        <Table columns={columns} data={data?.data || []} />
        <div className="mt-4">
          <Pagination meta={data?.meta} onPageChange={setPage} />
        </div>
      </div>

      {/* New Refund Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Refund">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select Ticket"
            options={ticketOptions}
            value={form.ticket_id}
            onChange={(e) => setForm({ ...form, ticket_id: e.target.value })}
            placeholder="Choose an active ticket..."
          />
          <TextArea
            label="Reason for Refund"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Please explain why you need a refund..."
            rows={3}
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" loading={createRefundMutation.isPending}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
