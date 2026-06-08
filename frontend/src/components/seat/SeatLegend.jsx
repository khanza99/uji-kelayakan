import { SEAT_STATUS } from '@/utils/constants';

export default function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs">
      {Object.entries(SEAT_STATUS).map(([key, { label, color }]) => (
        <div key={key} className="flex items-center gap-1.5">
          <div
            className={`w-4 h-4 rounded border ${
              key === 'available'
                ? 'bg-success-500/20 border-success-500/40'
                : key === 'reserved'
                ? 'bg-warning-500/20 border-warning-500/40'
                : key === 'sold'
                ? 'bg-danger-500/20 border-danger-500/40'
                : 'bg-surface-700/50 border-surface-600'
            }`}
          />
          <span className="text-surface-400">{label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-primary-500/30 border border-primary-500 ring-1 ring-primary-500/30" />
        <span className="text-surface-400">Selected</span>
      </div>
    </div>
  );
}
