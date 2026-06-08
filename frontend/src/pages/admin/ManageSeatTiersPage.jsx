import { useState } from 'react';
import { useConcerts } from '@/hooks/useConcerts';
import { useSeatTiers, useCreateSeatTier, useUpdateSeatTier, useDeleteSeatTier } from '@/hooks/useSeatTiers';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { PageSpinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';

export default function ManageSeatTiersPage() {
  const [selectedConcert, setSelectedConcert] = useState('');
  const { data: concertsData } = useConcerts({ limit: 100 });
  const { data: tiersData, isLoading: tiersLoading } = useSeatTiers(selectedConcert);
  
  const createMutation = useCreateSeatTier();
  const updateMutation = useUpdateSeatTier();
  const deleteMutation = useDeleteSeatTier();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', total_seats: '' });

  const openModal = (tier = null) => {
    if (tier) {
      setEditingId(tier.id);
      setForm({ name: tier.name, price: tier.price, total_seats: tier.total_seats });
    } else {
      setEditingId(null);
      setForm({ name: '', price: '', total_seats: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: form });
        toast.success('Seat tier updated');
      } else {
        await createMutation.mutateAsync({ ...form, concert_id: selectedConcert });
        toast.success('Seat tier created. Note: Seats are generated automatically by the backend.');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this seat tier? This will also delete all associated seats.')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Seat tier deleted');
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  const concertOptions = (concertsData?.data || []).map(c => ({ value: c.id, label: c.title }));

  const columns = [
    { key: 'name', label: 'Name', render: (val) => <span className="font-semibold text-black">{val}</span> },
    { key: 'price', label: 'Price', render: (val) => formatCurrency(val) },
    { key: 'total_seats', label: 'Total Seats' },
    { key: 'available_seats', label: 'Available' },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="xs" variant="secondary" onClick={() => openModal(row)}>Edit</Button>
          <Button size="xs" variant="danger" outline onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold font-display text-black">Manage Seat Tiers</h1>
        <Button variant="accent" onClick={() => openModal()} disabled={!selectedConcert}>Add Seat Tier</Button>
      </div>

      <div className="w-full sm:w-1/3">
        <Select
          label="Select Concert"
          options={concertOptions}
          value={selectedConcert}
          onChange={(e) => setSelectedConcert(e.target.value)}
          placeholder="Choose a concert..."
        />
      </div>

      {selectedConcert ? (
        <div className="glass rounded-xl p-4 border border-surface-800">
          {tiersLoading ? <div className="py-8"><PageSpinner /></div> : (
            <Table columns={columns} data={tiersData || []} />
          )}
        </div>
      ) : (
        <div className="text-center py-20 text-surface-500 border border-dashed border-surface-800 rounded-xl">
          Please select a concert to manage seat tiers
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Tier" : "New Tier"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Tier Name (e.g. VIP, Festival)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <Input label="Price (IDR)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          {!editingId && (
            <Input label="Total Seats (Will generate seats automatically)" type="number" value={form.total_seats} onChange={e => setForm({...form, total_seats: e.target.value})} required />
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="accent" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
