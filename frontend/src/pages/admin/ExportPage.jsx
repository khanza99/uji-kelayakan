import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { exportOrdersExcel, exportOrdersPdf, exportTicketsExcel, exportConcertsExcel, downloadBlob } from '@/api/exportApi';
import toast from 'react-hot-toast';

export default function ExportPage() {
  const [loadingType, setLoadingType] = useState(null);

  const handleExport = async (apiCall, filename, type) => {
    setLoadingType(type);
    try {
      const response = await apiCall();
      downloadBlob(response.data, filename);
      toast.success('Export downloaded successfully');
    } catch (err) {
      toast.error('Failed to export data');
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-black">Data Export</h1>
        <p className="text-surface-400 text-sm mt-1">Export system data to Excel or PDF formats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Export */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-black flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Orders Data
            </h3>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-surface-400 mb-6">Export all order records including customer details, amounts, and statuses.</p>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={() => handleExport(exportOrdersExcel, 'Orders_Export.xlsx', 'orders-excel')}
                loading={loadingType === 'orders-excel'}
              >
                Download Excel
              </Button>
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={() => handleExport(exportOrdersPdf, 'Orders_Report.pdf', 'orders-pdf')}
                loading={loadingType === 'orders-pdf'}
              >
                Download PDF
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Tickets Export */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-black flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Tickets Data
            </h3>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-surface-400 mb-6">Export all generated tickets, including associated concerts, seats, and scan status.</p>
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => handleExport(exportTicketsExcel, 'Tickets_Export.xlsx', 'tickets-excel')}
              loading={loadingType === 'tickets-excel'}
            >
              Download Excel
            </Button>
          </Card.Body>
        </Card>

        {/* Concerts Export */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-black flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Concerts Master Data
            </h3>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-surface-400 mb-6">Export the catalog of all concerts, venues, and aggregated availability metrics.</p>
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => handleExport(exportConcertsExcel, 'Concerts_Export.xlsx', 'concerts-excel')}
              loading={loadingType === 'concerts-excel'}
            >
              Download Excel
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
