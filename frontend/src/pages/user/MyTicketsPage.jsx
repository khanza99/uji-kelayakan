import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '@/hooks/useTickets';
import TicketCard from '@/components/ticket/TicketCard';
import { PageSpinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTickets({ page, sort_by: 'created_at', sort_order: 'desc' });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-black">My Tickets</h1>
        <p className="text-surface-400 text-sm mt-1">View and manage your concert tickets.</p>
      </div>

      {!data?.data?.length ? (
        <div className="glass rounded-2xl border border-surface-800">
          <EmptyState
            title="No tickets found"
            description="You don't have any tickets yet. Complete an order to get your tickets."
            action={
              <button
                onClick={() => navigate('/my-orders')}
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                View Orders →
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.data.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={(t) => navigate(`/my-tickets/${t.id}`)}
            />
          ))}

          <div className="col-span-full pt-4">
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
