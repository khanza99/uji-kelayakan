import { useParams } from 'react-router-dom';
import { useTicket, useTicketQR } from '@/hooks/useTickets';
import { downloadTicketPDF } from '@/api/ticketApi';
import { downloadBlob } from '@/api/exportApi';
import { PageSpinner } from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TicketStatusBadge from '@/components/ticket/TicketStatusBadge';
import { formatDate, formatTime } from '@/utils/formatDate';
import toast from 'react-hot-toast';

export default function TicketDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useTicket(id);
  const ticket = data?.ticket;
  const { data: qrUrl, isLoading: qrLoading } = useTicketQR(id);

  if (isLoading) return <PageSpinner />;
  if (!ticket) return <div className="text-center py-20">Ticket not found</div>;

  const concert = ticket.order_item?.seat?.seat_tier?.concert;
  const seat = ticket.order_item?.seat;
  const tier = ticket.order_item?.seat_tier || ticket.order_item?.seat?.seat_tier;

  const handleDownloadPdf = async () => {
    try {
      const response = await downloadTicketPDF(id);
      downloadBlob(response.data, `Ticket-${ticket.ticket_code}.pdf`);
      toast.success('Download started');
    } catch (err) {
      toast.error('Failed to download ticket');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-black font-mono">
            {ticket.ticket_code}
          </h1>
          <p className="text-surface-400 text-sm mt-1">Electronic Ticket</p>
        </div>
        <Button onClick={handleDownloadPdf} variant="outline" icon={(p) => (
          <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}>
          Download PDF
        </Button>
      </div>

      <Card className="overflow-hidden p-0 relative">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary-600 to-accent-600" />
        <Card.Body className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* QR Code */}
            <div className="w-48 shrink-0 flex flex-col items-center">
              <div className="w-40 h-40 bg-white p-2 rounded-xl">
                {qrLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-surface-500">
                    Loading QR...
                  </div>
                ) : qrUrl ? (
                  <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-surface-200" />
                )}
              </div>
              <div className="mt-4">
                <TicketStatusBadge status={ticket.status} />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <p className="text-sm text-primary-400 font-semibold uppercase tracking-wider mb-1">
                  Concert Pass
                </p>
                <h2 className="text-3xl font-bold font-display text-black">
                  {concert?.title}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-surface-500 mb-1">Date</p>
                  <p className="font-medium text-black">{formatDate(concert?.concert_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500 mb-1">Time</p>
                  <p className="font-medium text-black">{formatTime(concert?.start_time)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-surface-500 mb-1">Venue</p>
                  <p className="font-medium text-black">{concert?.venue?.name}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-800 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-surface-500 mb-1">Tier / Category</p>
                  <p className="font-medium text-accent-400">{tier?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500 mb-1">Seat Number</p>
                  <p className="font-medium text-accent-400">{seat?.seat_number}</p>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
