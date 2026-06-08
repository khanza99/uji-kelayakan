import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { PageSpinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ManageCategoriesPage() {
  const { data, isLoading } = useCategories();
  
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const openModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setForm({ name: category.name, description: category.description || '' });
    } else {
      setEditingId(null);
      setForm({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: form });
        toast.success('Category updated');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Category created');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Category deleted');
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  if (isLoading) return <PageSpinner />;

  const columns = [
    { key: 'name', label: 'Name', render: (val) => <span className="font-semibold text-black">{val}</span> },
    { key: 'slug', label: 'Description' },
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
        <h1 className="text-2xl font-bold font-display text-black">Manage Categories</h1>
        <Button variant="accent" onClick={() => openModal()}>Add Category</Button>
      </div>

      <div className="glass rounded-xl p-4 border border-surface-800">
        <Table columns={columns} data={data || []} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Category" : "New Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <TextArea label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="accent" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
