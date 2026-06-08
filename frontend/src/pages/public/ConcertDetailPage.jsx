import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConcert } from '@/hooks/useConcerts';
import useAuthStore from '@/store/authStore';
import { STORAGE_URL } from '@/utils/constants';
import { formatDate, formatTime } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { PageSpinner } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import ConcertStatusBadge from '@/components/concert/ConcertStatusBadge';
import SeatMap from '@/components/seat/SeatMap';
import SeatTierCard from '@/components/seat/SeatTierCard';
import toast from 'react-hot-toast';

export default function ConcertDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading } = useConcert(id);
  const concert = data?.concert;

  const [activeTier, setActiveTier] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

  if (isLoading) return <PageSpinner />;
  if (!concert) return (
    <div className="flex items-center justify-center min-h-[60vh] text-surface-500">
      Concert not found
    </div>
  );

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book tickets');
      navigate('/login');
      return;
    }
    if (!activeTier && selectedSeatIds.length === 0) {
      toast.error('Please select a seat tier or specific seats');
      return;
    }
    navigate('/checkout', {
      state: { concert, tier: activeTier, seatIds: selectedSeatIds },
    });
  };

  const totalPrice = activeTier ? activeTier.price * (selectedSeatIds.length || 1) : 0;

  return (
    <div className="bg-white min-h-screen">
      {/* ─── Hero Banner ─── */}
      <div className="relative h-[45vh] sm:h-[55vh] min-h-[320px] max-h-[560px] overflow-hidden bg-surface-900">
        {concert.poster_image ? (
          <>
            <img
              src={`${STORAGE_URL}/${concert.poster_image}`}
              alt={concert.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-900/80 to-surface-900/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900" />
        )}

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent" />

        {/* Concert info overlay */}
        <div className="absolute inset-0 flex items-end pb-10">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              {/* Poster thumbnail */}
              {concert.poster_image && (
                <div className="hidden md:block w-40 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-2xl shrink-0">
                  <img
                    src={`${STORAGE_URL}/${concert.poster_image}`}
                    alt={concert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="mb-3">
                  <ConcertStatusBadge status={concert.status} />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white leading-tight mb-4">
                  {concert.title}
                </h1>
                <div className="flex flex-wrap items-center gap-5 text-sm text-white/80">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-cta-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(concert.concert_date)}
                  </span>
                  {concert.start_time && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-cta-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(concert.start_time)}
                    </span>
                  )}
                  {concert.venue && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-cta-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {concert.venue.name}
                      {concert.venue.city && <span className="text-white/50">, {concert.venue.city}</span>}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Details + Seats */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            {concert.description && (
              <section className="bg-white rounded-2xl border border-surface-100 p-6"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <h3 className="text-lg font-bold text-surface-900 mb-4 pb-3 border-b border-surface-100">
                  About the Concert
                </h3>
                <p className="text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {concert.description}
                </p>
              </section>
            )}

            {/* Seat Tiers */}
            {concert.status === 'published' && concert.seat_tiers?.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-surface-900 mb-5">
                  Choose Your Ticket
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {concert.seat_tiers.map((tier) => (
                    <SeatTierCard
                      key={tier.id}
                      tier={tier}
                      active={activeTier?.id === tier.id}
                      onClick={(t) => {
                        setActiveTier(t);
                        setSelectedSeatIds([]);
                      }}
                    />
                  ))}
                </div>

                {activeTier && (
                  <div className="bg-white rounded-2xl border border-surface-100 p-6"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <h4 className="font-semibold text-surface-900 mb-5 text-center">
                      {activeTier.name} — Seat Map
                    </h4>
                    <SeatMap
                      seats={activeTier.seats || []}
                      selectedIds={selectedSeatIds}
                      onSelect={setSelectedSeatIds}
                    />
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right: Booking Summary */}
          <div>
            <div className="sticky top-20 bg-white rounded-2xl border border-surface-100 overflow-hidden"
              style={{ boxShadow: '0 4px 24px rgba(37,99,235,0.08), 0 1px 4px rgba(0,0,0,0.05)' }}>

              {/* Header */}
              <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
                <h3 className="font-bold text-primary-900">Booking Summary</h3>
              </div>

              <div className="p-6">
                {activeTier ? (
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-surface-500">Tier</span>
                      <span className="font-semibold text-surface-900">{activeTier.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-surface-500">Price per seat</span>
                      <span className="font-semibold text-surface-900">{formatCurrency(activeTier.price)}</span>
                    </div>
                    {selectedSeatIds.length > 0 && (
                      <>
                        <div className="flex justify-between items-start text-sm">
                          <span className="text-surface-500">Seats ({selectedSeatIds.length})</span>
                          <span className="font-medium text-surface-700 text-right max-w-[160px]">
                            {selectedSeatIds
                              .map((sid) => activeTier.seats?.find((s) => s.id === sid)?.seat_number)
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                        <div className="pt-4 border-t border-surface-100 flex justify-between items-center">
                          <span className="font-semibold text-surface-700">Total</span>
                          <span className="text-2xl font-black text-primary-600">
                            {formatCurrency(totalPrice)}
                          </span>
                        </div>
                      </>
                    )}
                    {selectedSeatIds.length === 0 && (
                      <p className="text-xs text-surface-400 italic bg-surface-50 rounded-xl p-3 text-center">
                        Select seats on the map to continue
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-6 text-center py-6">
                    <div className="w-12 h-12 rounded-xl bg-surface-50 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <p className="text-sm text-surface-400">Select a tier above to begin</p>
                  </div>
                )}

                <Button
                  variant="cta"
                  fullWidth
                  size="lg"
                  className="!rounded-2xl !py-3.5 font-bold"
                  disabled={!activeTier || selectedSeatIds.length === 0 || concert.status !== 'published'}
                  onClick={handleCheckout}
                >
                  {concert.status !== 'published' ? 'Tickets Not Available' : 'Proceed to Checkout →'}
                </Button>

                {concert.status === 'published' && (
                  <p className="mt-3 text-center text-xs text-surface-400">
                    🔒 Secure, encrypted checkout
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
