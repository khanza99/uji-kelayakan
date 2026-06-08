import SeatItem from './SeatItem';
import SeatLegend from './SeatLegend';
import Spinner from '@/components/ui/Spinner';

export default function SeatMap({
  seats = [],
  selectedIds = [],
  onSelect,
  loading = false,
}) {
  if (loading) return <Spinner className="py-12" />;

  const handleSelect = (seat) => {
    if (selectedIds.includes(seat.id)) {
      onSelect(selectedIds.filter((id) => id !== seat.id));
    } else {
      onSelect([...selectedIds, seat.id]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stage indicator */}
      <div className="w-full max-w-md mx-auto">
        <div className="h-2 rounded-full bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 opacity-60" />
        <p className="text-center text-[10px] text-surface-500 mt-1 uppercase tracking-widest">Stage</p>
      </div>

      {/* Seat grid */}
      <div className="flex flex-wrap justify-center gap-1.5 py-4">
        {seats.map((seat) => (
          <SeatItem
            key={seat.id}
            seat={seat}
            selected={selectedIds.includes(seat.id)}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Legend */}
      <SeatLegend />
    </div>
  );
}
