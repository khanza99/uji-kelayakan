import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useUsers';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { PageSpinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import UserRoleBadge from '@/components/user/UserRoleBadge';
import { USER_ROLES } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function ManageUsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers({ page });
  
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });

  const openModal = (user = null) => {
    if (user) {
      setEditingId(user.id);
      setForm({ name: user.name, email: user.email, password: '', role: user.roles?.[0]?.name || user.role || 'user' });
    } else {
      setEditingId(null);
      setForm({ name: '', email: '', password: '', role: 'user' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Only send password if it's not empty
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password;
        await updateMutation.mutateAsync({ id: editingId, data: updateData });
        toast.success('User updated');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('User created');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('User deleted');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (isLoading) return <PageSpinner />;

  const columns = [
    { key: 'name', label: 'Name', render: (val) => <span className="font-semibold text-black">{val}</span> },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (_, row) => <UserRoleBadge role={row.roles?.[0]?.name || row.role} /> },
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

  const roleOptions = Object.entries(USER_ROLES).map(([val, { label }]) => ({ value: val, label }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display text-black">Manage Users</h1>
        <Button variant="accent" onClick={() => openModal()}>Add User</Button>
      </div>

      <div className="glass rounded-xl p-4 border border-surface-800">
        <Table columns={columns} data={data?.data || []} />
        <div className="mt-4"><Pagination meta={data?.meta} onPageChange={setPage} /></div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit User" : "New User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <Input label={editingId ? "Password (leave blank to keep current)" : "Password"} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editingId} />
          <Select label="Role" options={roleOptions} value={form.role} onChange={e => setForm({...form, role: e.target.value})} required />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="accent" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
