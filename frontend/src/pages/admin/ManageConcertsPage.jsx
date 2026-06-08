import { useState } from 'react';
import { useConcerts, useCreateConcert, useUpdateConcert, useDeleteConcert } from '@/hooks/useConcerts';
import { useCategories } from '@/hooks/useCategories';
import { useVenues } from '@/hooks/useVenues';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';
import FileUpload from '@/components/ui/FileUpload';
import { PageSpinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import ConcertStatusBadge from '@/components/concert/ConcertStatusBadge';
import { CONCERT_STATUS } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function ManageConcertsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useConcerts({ page, limit: 10 });
  const { data: categoriesData } = useCategories();
  const { data: venuesData } = useVenues();

  const createMutation = useCreateConcert();
  const updateMutation = useUpdateConcert();
  const deleteMutation = useDeleteConcert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', concert_date: '', start_time: '',
    venue_id: '', category_id: '', status: 'draft',
  });
  const [posterFile, setPosterFile] = useState(null);

  const openModal = (concert = null) => {
    if (concert) {
      setEditingId(concert.id);
      setForm({
        title: concert.title,
        description: concert.description,
        concert_date: concert.concert_date,
        start_time: concert.start_time || '',
        venue_id: concert.venue_id,
        category_id: concert.category_id,
        status: concert.status,
      });
    } else {
      setEditingId(null);
      setForm({
        title: '', description: '', concert_date: '', start_time: '',
        venue_id: '', category_id: '', status: 'draft',
      });
    }
    setPosterFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send plain object so concertApi.createConcert can build FormData correctly
    const payload = { ...form };
    if (posterFile) payload.poster_image = posterFile;

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: payload });
        toast.success('Concert updated');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Concert created');
      }
      setIsModalOpen(false);
    } catch (err) {
      // Show validation errors if present
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors).flat()[0];
        toast.error(first || 'Validation failed');
      } else {
        toast.error(err.response?.data?.message || 'Action failed');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this concert?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Concert deleted');
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  if (isLoading) return <PageSpinner />;

  const columns = [
    { key: 'title', label: 'Title', render: (val) => <span className="font-semibold text-black">{val}</span> },
    { key: 'concert_date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (val) => <ConcertStatusBadge status={val} /> },
    { 
      key: 'category', 
      label: 'Category', 
      render: (_, row) => row.category?.name || categoriesData?.find(c => c.id === row.category_id)?.name || '-',
    },
    { 
      key: 'venue', 
      label: 'Venue', 
      render: (_, row) => row.venue?.name || venuesData?.data?.find(v => v.id === row.venue_id)?.name || '-',
    },
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

  const statusOptions = Object.entries(CONCERT_STATUS).map(([val, { label }]) => ({ value: val, label }));
  const catOptions = categoriesData?.map(c => ({ value: c.id, label: c.name })) || [];
  const venueOptions = venuesData?.data?.map(v => ({ value: v.id, label: v.name })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display text-black">Manage Concerts</h1>
        <Button variant="accent" onClick={() => openModal()}>Create Concert</Button>
      </div>

      <div className="glass rounded-xl p-4 border border-surface-800">
        <Table columns={columns} data={data?.data || []} />
        <div className="mt-4"><Pagination meta={data?.meta} onPageChange={setPage} /></div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Concert" : "New Concert"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <TextArea label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.concert_date} onChange={e => setForm({...form, concert_date: e.target.value})} required />
            <Input label="Time" type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" options={catOptions} value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} required />
            <Select label="Venue" options={venueOptions} value={form.venue_id} onChange={e => setForm({...form, venue_id: e.target.value})} required />
          </div>
          <Select label="Status" options={statusOptions} value={form.status} onChange={e => setForm({...form, status: e.target.value})} required />
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Poster Image</label>
            <FileUpload accept={{'image/*': []}} onFile={setPosterFile} />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="accent" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
