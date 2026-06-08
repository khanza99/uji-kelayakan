import { useState, useEffect } from 'react';
import { useConcerts } from '@/hooks/useConcerts';
import { useSeatTiers } from '@/hooks/useSeatTiers';
import { useSeats, useUpdateSeat } from '@/hooks/useSeats';
import Select from '@/components/ui/Select';
import { PageSpinner } from '@/components/ui/Spinner';
import SeatMap from '@/components/seat/SeatMap';
import Button from '@/components/ui/Button';
import { SEAT_STATUS } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function ManageSeatsPage() {
  const [selectedConcert, setSelectedConcert] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  
  const { data: concertsData } = useConcerts({ limit: 100 });
  const { data: tiersData } = useSeatTiers(selectedConcert);
  const { data: seatsData, isLoading: seatsLoading } = useSeats(selectedTier);
  
  const updateSeatMutation = useUpdateSeat();

  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [newStatus, setNewStatus] = useState('available');

  useEffect(() => {
    // avoid synchronous setState in effect to prevent cascading renders
    const t = setTimeout(() => {
      setSelectedTier('');
      setSelectedSeatIds([]);
    }, 0);
    return () => clearTimeout(t);
  }, [selectedConcert]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSelectedSeatIds([]);
    }, 0);
    return () => clearTimeout(t);
  }, [selectedTier]);

  const handleUpdateStatus = async () => {
    if (selectedSeatIds.length === 0) return toast.error('Select seats first');
    
    let successCount = 0;
    try {
      // Basic sequential update for simplicity
      for (const id of selectedSeatIds) {
        await updateSeatMutation.mutateAsync({ id, data: { status: newStatus } });
        successCount++;
      }
      toast.success(`Updated ${successCount} seats to ${newStatus}`);
      setSelectedSeatIds([]);
    } catch {
      toast.error('Some updates failed');
    }
  };

  const concertOptions = (concertsData?.data || []).map(c => ({ value: c.id, label: c.title }));
  const tierOptions = (tiersData || []).map(t => ({ value: t.id, label: t.name }));
  const statusOptions = Object.entries(SEAT_STATUS).map(([value, { label }]) => ({ value, label }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-black">Manage Seats</h1>
        <p className="text-surface-400 text-sm mt-1">Block or unblock specific seats manually.</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Select
            label="Select Concert"
            options={concertOptions}
            value={selectedConcert}
            onChange={(e) => setSelectedConcert(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Select
            label="Select Tier"
            options={tierOptions}
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            disabled={!selectedConcert}
          />
        </div>
      </div>

      {selectedTier ? (
        <div className="glass rounded-xl p-6 border border-surface-800">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-surface-800">
            <h3 className="font-semibold text-black">Seat Map Configuration</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-surface-400">{selectedSeatIds.length} selected</span>
              <Select
                options={statusOptions}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-40 !py-1.5"
              />
              <Button size="sm" variant="accent" onClick={handleUpdateStatus} disabled={selectedSeatIds.length === 0 || updateSeatMutation.isPending}>
                Apply Status
              </Button>
            </div>
          </div>

          {seatsLoading ? (
            <div className="py-12"><PageSpinner /></div>
          ) : (
            <div className="max-w-4xl mx-auto overflow-x-auto pb-8">
              <SeatMap
                seats={Array.isArray(seatsData) ? seatsData : seatsData?.data || []}
                selectedIds={selectedSeatIds}
                onSelect={setSelectedSeatIds}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 text-surface-500 border border-dashed border-surface-800 rounded-xl">
          Please select a concert and tier to manage seats
        </div>
      )}
    </div>
  );
}
