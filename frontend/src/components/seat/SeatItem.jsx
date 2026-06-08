import { formatCurrency } from '@/utils/formatCurrency';
import { SEAT_STATUS } from '@/utils/constants';

export default function SeatItem({ seat, selected, onSelect, disabled = false }) {
  const status = seat.status;
  const isAvailable = status === 'available';
  const isSelected = selected;

  const colorMap = {
    available: 'bg-success-500/20 border-success-500/40 text-success-400 hover:bg-success-500/30',
    reserved: 'bg-warning-500/20 border-warning-500/40 text-warning-400 cursor-not-allowed',
    sold: 'bg-danger-500/20 border-danger-500/40 text-danger-400 cursor-not-allowed',
    blocked: 'bg-surface-700/50 border-surface-600 text-surface-500 cursor-not-allowed',
  };

  const selectedStyle = 'bg-primary-500/30 border-primary-500 text-primary-300 ring-2 ring-primary-500/30';

  return (
    <button
      onClick={() => isAvailable && !disabled && onSelect?.(seat)}
      disabled={!isAvailable || disabled}
      title={`Seat ${seat.seat_number} — ${SEAT_STATUS[status]?.label || status}`}
      className={`
        w-9 h-9 rounded-lg border text-[10px] font-bold
        flex items-center justify-center
        transition-all duration-200
        ${isSelected ? selectedStyle : colorMap[status] || colorMap.blocked}
        ${isAvailable && !disabled ? 'active:scale-90' : ''}
      `}
    >
      {seat.seat_number}
    </button>
  );
}
