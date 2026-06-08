import { formatDate } from '@/utils/formatDate';
import TicketStatusBadge from './TicketStatusBadge';

export default function TicketCard({ ticket, onClick }) {
  const concert = ticket.order_item?.seat?.seat_tier?.concert;
  const seat = ticket.order_item?.seat;
  const tier = ticket.order_item?.seat_tier || ticket.order_item?.seat?.seat_tier;

  return (
    <button
      onClick={() => onClick?.(ticket)}
      className="w-full text-left group"
    >
      <div className="relative rounded-2xl overflow-hidden bg-surface-900/80 border border-surface-800 hover:border-surface-700 transition-all duration-200">
        {/* Ticket stub effect */}
        <div className="flex">
          {/* Left side */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-mono text-primary-400">{ticket.ticket_code}</p>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <h4 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-primary-400 transition-colors">
              {concert?.title || 'Concert'}
            </h4>
            <div className="mt-2 space-y-1 text-xs text-surface-400">
              {concert?.concert_date && (
                <p>{formatDate(concert.concert_date)}</p>
              )}
              {tier && <p>Tier: {tier.name}</p>}
              {seat && <p>Seat: {seat.seat_number}</p>}
            </div>
          </div>

          {/* Divider with circle cutouts */}
          <div className="relative w-px bg-surface-800">
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-surface-950" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-surface-950" />
            <div className="h-full border-l border-dashed border-surface-700" />
          </div>

          {/* Right side — QR hint */}
          <div className="w-20 flex items-center justify-center p-3">
            <div className="w-12 h-12 rounded-lg bg-surface-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
