import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConcerts } from '@/hooks/useConcerts';
import { useCategories } from '@/hooks/useCategories';
import { useVenues } from '@/hooks/useVenues';
import ConcertGrid from '@/components/concert/ConcertGrid';
import ConcertFilter from '@/components/concert/ConcertFilter';
import Pagination from '@/components/ui/Pagination';

export default function ConcertListPage() {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    status: 'published',
    page: 1,
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category') || '',
  });

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    if (search || category) {
      setFilters((prev) => ({ ...prev, search, category_id: category, page: 1 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apiParams = {
    page: filters.page,
    ...(filters.status     && { 'filter[status]':      filters.status }),
    ...(filters.category_id && { 'filter[category_id]': filters.category_id }),
    ...(filters.venue_id   && { 'filter[venue_id]':    filters.venue_id }),
    ...(filters.search     && { 'filter[title]':       filters.search }),
  };

  const { data: concertsData, isLoading } = useConcerts(apiParams);
  const { data: categoriesData } = useCategories();
  const { data: venuesData } = useVenues();

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-surface-50 border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
            Browse
          </p>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-surface-900 mb-2">
            Discover Events
          </h1>
          <p className="text-surface-500 text-sm sm:text-base max-w-xl">
            Find your next live experience. Filter by category, venue, or search by name.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div
          className="mb-8 p-4 rounded-2xl bg-white border border-surface-100"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 2px 12px rgba(37,99,235,0.04)' }}
        >
          <ConcertFilter
            filters={filters}
            onChange={handleFilterChange}
            categories={categoriesData?.data || []}
            venues={venuesData?.data || []}
          />
        </div>

        {/* Results meta */}
        {!isLoading && concertsData && (
          <div className="mb-5 flex items-center gap-2 text-sm text-surface-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>
              <span className="font-semibold text-surface-700">
                {concertsData?.meta?.total ?? concertsData?.data?.length ?? 0}
              </span>{' '}
              events found
            </span>
          </div>
        )}

        {/* Grid */}
        <ConcertGrid concerts={concertsData?.data || []} loading={isLoading} />

        {/* Pagination */}
        <div className="mt-10">
          <Pagination meta={concertsData?.meta} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}
