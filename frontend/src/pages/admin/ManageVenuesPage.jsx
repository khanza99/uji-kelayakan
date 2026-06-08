import { useState } from 'react';
import { useVenues, useCreateVenue, useUpdateVenue, useDeleteVenue } from '@/hooks/useVenues';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { PageSpinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

export default function ManageVenuesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useVenues({ page });
  
  const createMutation = useCreateVenue();
  const updateMutation = useUpdateVenue();
  const deleteMutation = useDeleteVenue();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', capacity: '' });

  const openModal = (venue = null) => {
    if (venue) {
      setEditingId(venue.id);
      setForm({ name: venue.name, address: venue.address, capacity: venue.capacity });
    } else {
      setEditingId(null);
      setForm({ name: '', address: '', capacity: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: form });
        toast.success('Venue updated');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Venue created');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this venue?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Venue deleted');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (isLoading) return <PageSpinner />;

  const columns = [
    { key: 'name', label: 'Name', render: (val) => <span className="font-semibold text-black  ">{val}</span> },
    { key: 'address', label: 'Address' },
    { key: 'capacity', label: 'Capacity' },
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display text-black">Manage Venues</h1>
        <Button variant="accent" onClick={() => openModal()}>Add Venue</Button>
      </div>

      <div className="glass rounded-xl p-4 border border-surface-800">
        <Table columns={columns} data={data?.data || []} />
        <div className="mt-4"><Pagination meta={data?.meta} onPageChange={setPage} /></div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Venue" : "New Venue"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <TextArea label="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
          <Input label="Capacity" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} required />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="accent" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
