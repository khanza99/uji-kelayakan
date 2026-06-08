import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useOrder, useCancelOrder } from '@/hooks/useOrders';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { PageSpinner } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import OrderTimer from '@/components/order/OrderTimer';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';
import api from '@/api/axios';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useOrder(id);
  const order = data?.order;
  const cancelOrderMutation = useCancelOrder();

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_name: '',
    payment_proof: null,
  });
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, payment_proof: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.payment_proof) {
      toast.error('Pilih foto bukti pembayaran terlebih dahulu');
      return;
    }
    if (!formData.bank_name || !formData.account_name) {
      toast.error('Isi nama bank dan nama pemilik rekening');
      return;
    }

    const fd = new FormData();
    fd.append('payment_proof', formData.payment_proof);
    fd.append('bank_name', formData.bank_name);
    fd.append('account_name', formData.account_name);

    try {
      setUploading(true);
      await api.post(`/orders/${id}/upload-proof`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Bukti pembayaran berhasil diupload! Menunggu konfirmasi admin.');
      qc.invalidateQueries({ queryKey: ['orders', id] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Gagal upload bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Yakin ingin membatalkan pesanan ini?')) {
      try {
        await cancelOrderMutation.mutateAsync(id);
        toast.success('Order berhasil dibatalkan');
      } catch {
        toast.error('Gagal membatalkan order');
      }
    }
  };

  if (isLoading) return <PageSpinner />;
  if (!order) return <div className="text-center py-20 text-surface-400">Order tidak ditemukan</div>;

  const isPending = order.status === 'pending';
  const isReviewing = order.payment?.status === 'reviewing';
  const bankInfo = {
    bank: import.meta.env.VITE_BANK_NAME ?? 'BCA',
    number: import.meta.env.VITE_BANK_ACCOUNT_NUMBER ?? '1234567890',
    name: import.meta.env.VITE_BANK_ACCOUNT_NAME ?? 'TixEvent',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold font-display text-black font-mono">
              {order.order_code}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-surface-400 text-sm">Dibuat pada {formatDateTime(order.created_at)}</p>
        </div>
        {isPending && (
          <div className="flex items-center gap-3">
            <OrderTimer expiresAt={order.expires_at} />
            <Button
              variant="danger"
              size="sm"
              outline
              onClick={handleCancel}
              loading={cancelOrderMutation.isPending}
            >
              Batalkan
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-black">Rincian Pesanan</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between p-3 rounded-lg bg-surface-800/50">
                  <div>
                    <p className="font-medium text-black text-sm">
                      Kursi: {item.seat?.seat_number}
                    </p>
                    <p className="text-xs text-black mt-1">
                      Tier: {item.seat_tier?.name ?? item.seat?.seat_tier?.name}
                    </p>
                  </div>
                  <p className="font-semibold text-accent-400 text-sm">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              ))}
            </Card.Body>
            <Card.Footer className="flex justify-between items-center">
              <span className="font-semibold text-surface-300">Total Pembayaran</span>
              <span className="text-xl font-bold text-accent-400">
                {formatCurrency(order.total_amount)}
              </span>
            </Card.Footer>
          </Card>

          {/* Info Rekening Bank */}
          {isPending && !isReviewing && (
            <Card>
              <Card.Header>
                <h3 className="font-semibold text-black flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Info Transfer Bank
                  <span className="ml-auto text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full px-2 py-0.5">
                    SIMULASI
                  </span>
                </h3>
              </Card.Header>
              <Card.Body className="space-y-3">
                <p className="text-sm text-surface-400">
                  Ini adalah simulasi pembayaran. Transfer ke rekening fiktif berikut, lalu upload foto bukti (boleh foto apa saja):
                </p>
                <div className="bg-surface-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Bank</span>
                    <span className="font-semibold text-white">{bankInfo.bank}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">No. Rekening</span>
                    <span className="font-mono font-bold text-white text-base">{bankInfo.number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Atas Nama</span>
                    <span className="font-semibold text-white">{bankInfo.name}</span>
                  </div>
                  <div className="border-t border-surface-700 pt-2 flex justify-between text-sm">
                    <span className="text-surface-400">Jumlah Transfer</span>
                    <span className="font-bold text-green-400 text-base">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
                <p className="text-xs text-purple-400 flex gap-1">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ini hanya simulasi — tidak ada uang sungguhan yang ditransfer. Upload foto apa saja sebagai "bukti bayar".
                </p>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Right — Upload Bukti / Status */}
        <div className="space-y-6">
          {isPending && !isReviewing ? (
            <Card>
              <Card.Header>
                <h3 className="font-semibold text-white">Upload Bukti Bayar</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleUpload} className="space-y-4">
                  {/* Preview */}
                  <div
                    className="w-full h-40 rounded-xl border-2 border-dashed border-surface-700 flex items-center justify-center cursor-pointer overflow-hidden bg-surface-800/50 hover:border-accent-500 transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
                    ) : (
                      <div className="text-center text-surface-500 text-sm">
                        <svg className="w-10 h-10 mx-auto mb-2 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Klik untuk pilih foto
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div>
                    <label className="block text-xs text-surface-400 mb-1">Nama Bank Pengirim</label>
                    <input
                      type="text"
                      placeholder="contoh: BCA, Mandiri, BNI..."
                      className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-accent-500"
                      value={formData.bank_name}
                      onChange={(e) => setFormData((p) => ({ ...p, bank_name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-surface-400 mb-1">Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      placeholder="Nama sesuai rekening"
                      className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-accent-500"
                      value={formData.account_name}
                      onChange={(e) => setFormData((p) => ({ ...p, account_name: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" fullWidth variant="accent" size="lg" loading={uploading}>
                    Upload Bukti Bayar
                  </Button>
                </form>
              </Card.Body>
            </Card>
          ) : isReviewing ? (
            <Card>
              <Card.Body className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-1">Menunggu Konfirmasi</h4>
                <p className="text-sm text-surface-400">
                  Bukti bayar sudah kami terima. Admin akan mengkonfirmasi dalam 1×24 jam.
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center py-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  order.status === 'paid' ? 'bg-green-500/10' : 'bg-surface-800'
                }`}>
                  {order.status === 'paid' ? (
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <h4 className="font-semibold text-black mb-1 capitalize">{order.status}</h4>
                {order.status === 'paid' && (
                  <Button className="mt-4" variant="primary" fullWidth onClick={() => navigate('/my-tickets')}>
                    Lihat Tiket Saya
                  </Button>
                )}
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
