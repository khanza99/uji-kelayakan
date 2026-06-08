import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useCreateOrder } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import { Landmark, CreditCard, Smartphone } from 'lucide-react';

const PAYMENT_OPTIONS = [
  { value: 'bank_transfer', label: 'Transfer Bank', icon: Landmark },
  { value: 'virtual_account', label: 'Virtual Account', icon: CreditCard },
  { value: 'ewallet', label: 'E-Wallet (OVO / GoPay / Dana)', icon: Smartphone },
];

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const checkoutData = location.state;

  if (!checkoutData || !checkoutData.concert || !checkoutData.tier || !checkoutData.seatIds) {
    return <Navigate to="/concerts" replace />;
  }

  const { concert, tier, seatIds } = checkoutData;
  const seats = tier.seats?.filter(s => seatIds.includes(s.id)) || [];
  const totalPrice = tier.price * seatIds.length;

  const handleCreateOrder = async () => {
    try {
      const response = await createOrderMutation.mutateAsync({
        seat_ids: seatIds,
        payment_method: paymentMethod,
      });

      const orderId = response.data.order?.id;
      toast.success('Order berhasil dibuat! Silakan upload bukti pembayaran.');
      navigate(`/my-orders/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat order. Kursi mungkin sudah diambil.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-black">Konfirmasi Pesanan</h1>
        <p className="text-surface-400 text-sm mt-1">Periksa pesanan Anda sebelum melanjutkan pembayaran</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left — Order Summary */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-black">Rincian Pesanan</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              {/* Concert Info */}
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-lg bg-surface-800 shrink-0 overflow-hidden">
                  {concert.poster_image && (
                    <img
                      src={`http://localhost:8000/storage/${concert.poster_image}`}
                      alt={concert.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white">{concert.title}</h4>
                  <p className="text-sm text-surface-400">{concert.venue?.name}</p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    Tier: <span className="text-accent-400 font-medium">{tier.name}</span>
                  </p>
                </div>
              </div>

              {/* Seats */}
              <div className="pt-4 border-t border-surface-800">
                <h5 className="text-sm font-medium text-surface-300 mb-3">Kursi yang Dipilih</h5>
                <div className="space-y-2">
                  {seats.length > 0 ? seats.map(seat => (
                    <div key={seat.id} className="flex justify-between items-center text-sm p-2.5 rounded-lg bg-surface-800/40">
                      <div>
                        <span className="text-white font-medium">Kursi: {seat.seat_number}</span>
                        <span className="text-surface-500 ml-2">({tier.name})</span>
                      </div>
                      <span className="text-accent-400 font-semibold">{formatCurrency(tier.price)}</span>
                    </div>
                  )) : (
                    /* Fallback jika seats tidak dikirim, tampilkan dari seatIds */
                    seatIds.map(id => (
                      <div key={id} className="flex justify-between items-center text-sm p-2.5 rounded-lg bg-surface-800/40">
                        <span className="text-white font-medium">Seat ID: {id}</span>
                        <span className="text-accent-400 font-semibold">{formatCurrency(tier.price)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-black">Metode Pembayaran</h3>
            </Card.Header>
            <Card.Body className="space-y-3">
              <p className="text-xs text-info-400 bg-info-500/10 border border-info-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4 shrink-0" />
                Ini adalah web simulasi — semua metode di bawah hanya untuk demo, tidak ada transaksi nyata.
              </p>
              {PAYMENT_OPTIONS.map(opt => {
                const IconComponent = opt.icon;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === opt.value
                        ? 'border-accent-500 bg-accent-500/10'
                        : 'border-surface-700 bg-surface-800/40 hover:border-surface-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-accent-500"
                    />
                    <IconComponent className={`w-5 h-5 ${paymentMethod === opt.value ? 'text-accent-400' : 'text-surface-400'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === opt.value ? 'text-accent-400' : 'text-surface-300'}`}>
                      {opt.label}
                    </span>
                    {paymentMethod === opt.value && (
                      <span className="ml-auto text-xs text-accent-400">✓ Dipilih</span>
                    )}
                  </label>
                );
              })}
            </Card.Body>
          </Card>
        </div>

        {/* Right — Price Summary */}
        <div>
          <Card className="sticky top-24">
            <Card.Header>
              <h3 className="font-semibold text-black">Ringkasan Biaya</h3>
            </Card.Header>
            <Card.Body className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Harga tiket ({seatIds.length}x)</span>
                <span className="text-black">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Biaya admin</span>
                <span className="text-green-400">Gratis</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Metode bayar</span>
                <span className="text-black capitalize">{PAYMENT_OPTIONS.find(o => o.value === paymentMethod)?.label ?? paymentMethod}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-surface-700">
                <span className="font-bold text-white">Total</span>
                <span className="text-xl font-bold text-accent-400">{formatCurrency(totalPrice)}</span>
              </div>

              <Button
                fullWidth
                variant="accent"
                size="lg"
                onClick={handleCreateOrder}
                loading={createOrderMutation.isPending}
                id="btn-place-order"
              >
                Buat Pesanan
              </Button>

              <p className="text-xs text-center text-surface-500">
                Setelah order dibuat, Anda akan diminta upload bukti pembayaran simulasi.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
