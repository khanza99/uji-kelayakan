import ConcertCard from './ConcertCard';
import EmptyState from '@/components/ui/EmptyState';

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-surface-100"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div className="skeleton aspect-[3/4]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-4/5 rounded-lg" />
        <div className="skeleton h-3 w-3/5 rounded-lg" />
        <div className="skeleton h-3 w-2/5 rounded-lg" />
        <div className="pt-2 border-t border-surface-100 flex justify-between">
          <div className="skeleton h-4 w-1/3 rounded-lg" />
          <div className="skeleton h-4 w-1/4 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ConcertGrid({ concerts = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (concerts.length === 0) {
    return (
      <EmptyState
        title="No events found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {concerts.map((concert) => (
        <ConcertCard key={concert.id} concert={concert} />
      ))}
    </div>
  );
}
