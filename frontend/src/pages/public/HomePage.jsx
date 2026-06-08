import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useConcerts } from '@/hooks/useConcerts';
import { useCategories } from '@/hooks/useCategories';
import ConcertCard from '@/components/concert/ConcertCard';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { STORAGE_URL } from '@/utils/constants';

/* ─── Category gradient palette ─── */
const CAT_GRADIENTS = [
  ['from-violet-500', 'to-purple-600'],
  ['from-blue-500', 'to-cyan-500'],
  ['from-rose-500', 'to-pink-500'],
  ['from-amber-400', 'to-orange-500'],
  ['from-emerald-500', 'to-teal-500'],
  ['from-indigo-500', 'to-blue-600'],
  ['from-fuchsia-500', 'to-pink-600'],
  ['from-sky-400', 'to-blue-500'],
];

/* ─── Stat item component ─── */
function Stat({ value, label }) {
  return (
    <div className="text-center px-6">
      <div className="text-3xl sm:text-4xl font-bold font-display text-white leading-none">{value}</div>
      <div className="text-sm text-white/70 mt-1.5">{label}</div>
    </div>
  );
}

/* ─── Hero slide ─── */
function HeroSlide({ concert, active }) {
  const lowestPrice = concert.seat_tiers?.reduce(
    (min, t) => (t.price < min ? t.price : min),
    concert.seat_tiers?.[0]?.price ?? 0
  );

  return (
    <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
      active ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02] pointer-events-none'
    }`}>
      {concert.poster_image ? (
        <img
          src={`${STORAGE_URL}/${concert.poster_image}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900" />
      )}

      {/* Multi-layer overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end lg:items-center pb-12 lg:pb-0">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {concert.category && (
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm text-white border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-cta-400 animate-pulse" />
                  {concert.category.name}
                </span>
              </div>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black font-display text-white leading-[1.1] tracking-tight mb-4">
              {concert.title}
            </h2>
            <div className="flex flex-wrap items-center gap-5 mb-8 text-sm text-white/75">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cta-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(concert.concert_date)}
              </span>
              {concert.venue && (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-cta-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {concert.venue.name}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/concerts/${concert.id}`}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-cta-500 hover:bg-cta-600 text-white font-bold text-sm transition-all shadow-xl shadow-black/20 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Buy Tickets
                {lowestPrice > 0 && (
                  <span className="px-2 py-0.5 rounded-lg bg-black/20 text-xs font-semibold">
                    {formatCurrency(lowestPrice)}
                  </span>
                )}
              </Link>
              <Link
                to="/concerts"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm transition-all border border-white/20 backdrop-blur-sm"
              >
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton card ─── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-surface-100 animate-pulse"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div className="skeleton aspect-[3/4]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-4/5 rounded-lg" />
        <div className="skeleton h-3 w-3/5 rounded-lg" />
        <div className="skeleton h-3 w-2/5 rounded-lg" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HOMEPAGE
══════════════════════════════════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimer = useRef(null);

  const { data: concertsData, isLoading } = useConcerts({
    status: 'published',
    sort_by: 'concert_date',
    sort_order: 'asc',
    per_page: 8,
  });

  const { data: categoriesData } = useCategories();

  const concerts    = concertsData?.data || [];
  const categories  = categoriesData?.data || [];
  const featured    = concerts.slice(0, 5);

  /* Hero auto-rotate */
  useEffect(() => {
    if (featured.length <= 1) return;
    heroTimer.current = setInterval(
      () => setHeroIndex((i) => (i + 1) % featured.length),
      5500
    );
    return () => clearInterval(heroTimer.current);
  }, [featured.length]);

  const resetTimer = () => {
    clearInterval(heroTimer.current);
    if (featured.length > 1) {
      heroTimer.current = setInterval(
        () => setHeroIndex((i) => (i + 1) % featured.length),
        5500
      );
    }
  };

  const goSlide = (i) => { setHeroIndex(i); resetTimer(); };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim()
      ? `/concerts?search=${encodeURIComponent(search.trim())}`
      : '/concerts'
    );
  };

  return (
    <div className="bg-white">
      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative h-[88vh] min-h-[560px] max-h-[840px] overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900" />
        ) : featured.length === 0 ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900" />
        ) : (
          featured.map((c, i) => (
            <HeroSlide key={c.id} concert={c} active={i === heroIndex} />
          ))
        )}

        {/* Bottom fade into white */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        {/* Carousel controls */}
        {featured.length > 1 && (
          <>
            {/* Arrow prev */}
            <button
              onClick={() => goSlide((heroIndex - 1 + featured.length) % featured.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all z-10"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Arrow next */}
            <button
              onClick={() => goSlide((heroIndex + 1) % featured.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all z-10"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goSlide(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === heroIndex
                      ? 'w-7 h-2.5 bg-cta-500'
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ═══════════════════════════════════════
          FLOATING SEARCH BAR
      ═══════════════════════════════════════ */}
      <section className="relative z-10 -mt-7 mb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 bg-white rounded-2xl border border-surface-100 p-2 pl-5"
            style={{ boxShadow: '0 8px 40px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <svg className="w-5 h-5 text-surface-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concerts, artists, venues…"
              className="flex-1 text-sm sm:text-base text-surface-900 placeholder-surface-400 bg-transparent focus:outline-none py-2"
            />
            <button
              type="submit"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-sm"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS BANNER
      ═══════════════════════════════════════ */}
      <section className="mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-10 px-6 sm:px-12">
            {/* Decorative shapes */}
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-cta-500/10 blur-2xl pointer-events-none" />

            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x sm:divide-white/15">
              <Stat value="500+" label="Live Events" />
              <Stat value="100K+" label="Happy Fans" />
              <Stat value="50+" label="Top Venues" />
              <Stat value="4.9 ★" label="User Rating" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="mt-16 bg-surface-50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Categories</p>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-surface-900">
                  Browse by Category
                </h2>
              </div>
              <Link
                to="/concerts"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                See all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
              {/* All Events */}
              <Link
                to="/concerts"
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-surface-100 hover:border-primary-200 hover:shadow-md hover:shadow-primary-100/50 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-sm shadow-primary-600/25 group-hover:shadow-md group-hover:shadow-primary-600/30 transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-surface-700 group-hover:text-primary-600 text-center transition-colors leading-tight">
                  All Events
                </span>
              </Link>

              {categories.slice(0, 15).map((cat, idx) => {
                const [from, to] = CAT_GRADIENTS[idx % CAT_GRADIENTS.length];
                return (
                  <Link
                    key={cat.id}
                    to={`/concerts?category=${cat.id}`}
                    className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-surface-100 hover:border-primary-200 hover:shadow-md hover:shadow-primary-100/50 transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center shadow-sm transition-all group-hover:shadow-md`}>
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-semibold text-surface-700 group-hover:text-primary-600 text-center transition-colors leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          UPCOMING EVENTS
      ═══════════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Don't Miss Out</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-surface-900">
                Upcoming Events
              </h2>
            </div>
            <Link
              to="/concerts"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : concerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 10l4.553-2.069A1 1 0 0121 8.882V15.5a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-surface-800 mb-2">No events yet</h3>
              <p className="text-surface-400 text-sm">Check back soon for upcoming concerts and events.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {concerts.map((concert) => (
                <ConcertCard key={concert.id} concert={concert} />
              ))}
            </div>
          )}

          {/* Mobile "view all" */}
          <div className="mt-8 sm:hidden">
            <Link
              to="/concerts"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-surface-200 text-surface-700 hover:border-primary-300 hover:text-primary-600 text-sm font-semibold transition-all"
            >
              View All Events
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section className="py-16 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">Simple & Fast</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 mb-3">
              How It Works
            </h2>
            <p className="text-surface-500 max-w-sm mx-auto text-sm leading-relaxed">
              Book your tickets in three easy steps and enjoy the show.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {/* Connector */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #e2e8f0 30%, #e2e8f0 70%, transparent)' }} />

            {[
              {
                step: '01', color: 'bg-primary-50 text-primary-600 border-primary-100',
                iconColor: 'text-primary-600',
                title: 'Find Your Event',
                desc: 'Browse hundreds of concerts, festivals, and live events filtered by city or category.',
                icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
              },
              {
                step: '02', color: 'bg-cta-50 text-cta-600 border-cta-100',
                iconColor: 'text-cta-600',
                title: 'Choose Your Seats',
                desc: 'Pick from VIP, regular or standing tiers. See real-time availability and transparent pricing.',
                icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
              },
              {
                step: '03', color: 'bg-success-50 text-success-700 border-success-100',
                iconColor: 'text-success-600',
                title: 'Pay & Enjoy',
                desc: 'Secure checkout via multiple payment methods. Get your e-ticket instantly to your email.',
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-surface-100 hover:border-primary-100 transition-all duration-200 hover:-translate-y-1 group"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 2px 16px rgba(37,99,235,0.04)' }}
              >
                <div className={`w-16 h-16 rounded-2xl border ${item.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                  <svg className={`w-7 h-7 ${item.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <span className="text-xs font-bold text-surface-300 mb-1 tracking-widest">{item.step}</span>
                <h3 className="text-base font-bold text-surface-900 mb-2">{item.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY US — Trust signals
      ═══════════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: '🔒', title: 'Secure Payments', desc: 'Bank-grade SSL encryption on every transaction.' },
              { icon: '⚡', title: 'Instant Tickets', desc: 'E-tickets delivered to your inbox in seconds.' },
              { icon: '💸', title: 'Easy Refunds', desc: 'Hassle-free refund process when events are cancelled.' },
              { icon: '🎯', title: '24/7 Support', desc: 'Our team is here to help you anytime, anywhere.' },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white border border-surface-100 hover:border-primary-100 transition-all hover:-translate-y-0.5"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h4 className="text-sm font-bold text-surface-900 mb-1.5">{item.title}</h4>
                <p className="text-xs text-surface-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════ */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-8 sm:p-14 text-center">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cta-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cta-400 animate-pulse" />
                Join 100,000+ fans on TixEvent
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-display text-white mb-4 leading-tight">
                Ready to experience<br className="hidden sm:block" /> live music again?
              </h2>
              <p className="text-primary-200/80 text-sm sm:text-base max-w-lg mx-auto mb-8">
                Book tickets for the hottest concerts and festivals. Fast checkout, instant e-tickets, and real support.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/concerts"
                  className="px-8 py-3.5 rounded-2xl bg-white text-primary-700 font-bold text-sm hover:bg-primary-50 transition-all shadow-xl shadow-black/15 hover:-translate-y-0.5"
                >
                  Browse Events
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-3.5 rounded-2xl bg-cta-500 hover:bg-cta-600 text-white font-bold text-sm transition-all shadow-lg shadow-cta-900/20 hover:-translate-y-0.5"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
