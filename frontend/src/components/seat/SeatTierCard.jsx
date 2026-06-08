import { formatCurrency } from '@/utils/formatCurrency';

export default function SeatTierCard({ tier, active, onClick }) {
  return (
    <button
      onClick={() => onClick?.(tier)}
      className={`
        text-left w-full p-4 rounded-xl border transition-all duration-200
        ${
          active
            ? 'bg-primary-500/10 border-primary-500/40 shadow-md shadow-primary-500/10'
            : 'bg-white border-surface-400 hover:border-surface-700'
        }
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={`font-semibold ${active ? 'text-primary-400' : 'text-black'}`}>
          {tier.name}
        </h4>
        <span className="text-sm font-bold text-accent-400">
          {formatCurrency(tier.price)}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-surface-400">
        <span>{tier.available_seats} / {tier.total_seats} available</span>
        {tier.seats_count !== undefined && (
          <span>· {tier.seats_count} seats</span>
        )}
      </div>
      {/* Availability bar */}
      <div className="mt-2 h-1.5 rounded-full bg-surface-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
          style={{
            width: `${tier.total_seats > 0 ? (tier.available_seats / tier.total_seats) * 100 : 0}%`,
          }}
        />
      </div>
    </button>
  );
}
