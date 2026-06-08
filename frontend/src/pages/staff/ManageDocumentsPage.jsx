import { useState } from 'react';
import { useConcerts } from '@/hooks/useConcerts';
import { useDocuments, useUploadDocument, useDeleteDocument } from '@/hooks/useDocuments';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import FileUpload from '@/components/ui/FileUpload';
import { PageSpinner } from '@/components/ui/Spinner';
import { DOC_TYPES, STORAGE_URL } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatDate';
import toast from 'react-hot-toast';

export default function ManageDocumentsPage() {
  const [selectedConcert, setSelectedConcert] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docType, setDocType] = useState('poster');
  const [file, setFile] = useState(null);

  const { data: concertsData, isLoading: concertsLoading } = useConcerts({ limit: 100 });
  const { data: documentsData, isLoading: docsLoading } = useDocuments(selectedConcert);
  
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedConcert || !file) return toast.error('Please select concert and file');

    try {
      await uploadMutation.mutateAsync({
        concert_id: selectedConcert,
        doc_type: docType,
        file: file,
      });
      toast.success('Document uploaded successfully');
      setIsModalOpen(false);
      setFile(null);
    } catch {
      toast.error('Failed to upload document');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this document?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Document deleted');
      } catch {
        toast.error('Failed to delete document');
      }
    }
  };

  if (concertsLoading) return <PageSpinner />;

  const concertOptions = (concertsData?.data || []).map(c => ({ value: c.id, label: c.title }));
  const docTypeOptions = Object.entries(DOC_TYPES).map(([value, label]) => ({ value, label }));

  const columns = [
    { key: 'file_name', label: 'File Name', render: (val) => <span className="font-medium text-black">{val}</span> },
    { key: 'doc_type', label: 'Type', render: (val) => <span className="capitalize text-primary-400">{val}</span> },
    { key: 'created_at', label: 'Uploaded At', render: (val) => formatDateTime(val) },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, row) => (
        <div className="flex gap-3">
          <a href={`${STORAGE_URL}/${row.file_path}`} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </a>
          <button onClick={() => handleDelete(row.id)} className="text-danger-400 hover:text-danger-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-black">Manage Documents</h1>
          <p className="text-surface-400 text-sm mt-1">Upload and manage concert flyers, posters, and contracts.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="accent" disabled={!selectedConcert}>
          Upload Document
        </Button>
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
          {docsLoading ? (
            <div className="py-12"><PageSpinner /></div>
          ) : (
            <Table columns={columns} data={documentsData || []} />
          )}
        </div>
      ) : (
        <div className="text-center py-20 text-surface-500 border border-dashed border-surface-800 rounded-xl">
          Please select a concert to view documents
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Document">
        <form onSubmit={handleUpload} className="space-y-4">
          <Select
            label="Document Type"
            options={docTypeOptions}
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">File</label>
            <FileUpload
              accept={{ 'image/*': ['.png', '.jpg'], 'application/pdf': ['.pdf'] }}
              onFile={setFile}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="accent" loading={uploadMutation.isPending}>Upload</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
