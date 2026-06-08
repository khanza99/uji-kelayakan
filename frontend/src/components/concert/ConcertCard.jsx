import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { STORAGE_URL } from '@/utils/constants';
import ConcertStatusBadge from './ConcertStatusBadge';

export default function ConcertCard({ concert }) {
  const lowestPrice = concert.seat_tiers?.reduce(
    (min, t) => (t.price < min ? t.price : min),
    concert.seat_tiers?.[0]?.price ?? 0
  );

  return (
    <Link
      to={`/concerts/${concert.id}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-surface-100 hover:border-primary-100 transition-all duration-300 hover:-translate-y-1.5"
      style={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 2px 12px rgba(37,99,235,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05), 0 2px 12px rgba(37,99,235,0.04)';
      }}
    >
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-100">
        {concert.poster_image ? (
          <img
            src={`${STORAGE_URL}/${concert.poster_image}`}
            alt={concert.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-surface-100 gap-2">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <svg className="w-7 h-7 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span className="text-xs text-surface-400 font-medium">No Image</span>
          </div>
        )}

        {/* Gradient overlay at bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <ConcertStatusBadge status={concert.status} />
        </div>

        {/* Price chip */}
        {lowestPrice > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm border border-white/60 text-xs font-bold text-surface-800 shadow-sm">
            {formatCurrency(lowestPrice)}
          </div>
        )}

        {/* Category pill at bottom */}
        {concert.category && (
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary-600 text-white shadow-sm">
              {concert.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-surface-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug mb-2.5">
          {concert.title}
        </h3>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <svg className="w-3.5 h-3.5 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-surface-600">{formatDate(concert.concert_date)}</span>
          </div>

          {concert.venue && (
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              <svg className="w-3.5 h-3.5 text-surface-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{concert.venue.name}</span>
            </div>
          )}
        </div>

        {/* Price + CTA row */}
        <div className="mt-3.5 pt-3 border-t border-surface-100 flex items-center justify-between">
          {/* <div>
            {lowestPrice === 0 ? (
              <span className="text-xs font-bold text-success-600">Free</span>
            ) : (
              <div>
                <span className="text-[10px] text-surface-400">From </span>
                <span className="text-sm font-bold text-surface-900">{formatCurrency(lowestPrice)}</span>
              </div>
            )}
          </div> */}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
            Buy Now
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
