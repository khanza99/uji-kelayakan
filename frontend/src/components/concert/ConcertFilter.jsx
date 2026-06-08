import SearchInput from '@/components/ui/SearchInput';
import Select from '@/components/ui/Select';
import { CONCERT_STATUS } from '@/utils/constants';

export default function ConcertFilter({ filters, onChange, categories = [], venues = [] }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const statusOptions = Object.entries(CONCERT_STATUS)
    .map(([value, { label }]) => ({ value, label }));

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const venueOptions    = venues.map((v) => ({ value: v.id, label: v.name }));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[200px]">
        <SearchInput
          value={filters.search || ''}
          onChange={(val) => handleChange('search', val)}
          placeholder="Search events…"
        />
      </div>
      <div className="w-40">
        <Select
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
          placeholder="All Status"
        />
      </div>
      {categoryOptions.length > 0 && (
        <div className="w-44">
          <Select
            options={categoryOptions}
            value={filters.category_id || ''}
            onChange={(e) => handleChange('category_id', e.target.value)}
            placeholder="All Categories"
          />
        </div>
      )}
      {venueOptions.length > 0 && (
        <div className="w-44">
          <Select
            options={venueOptions}
            value={filters.venue_id || ''}
            onChange={(e) => handleChange('venue_id', e.target.value)}
            placeholder="All Venues"
          />
        </div>
      )}

      {/* Clear filters */}
      {(filters.search || filters.category_id || filters.venue_id) && (
        <button
          onClick={() => onChange({ status: 'published', page: 1, search: '', category_id: '', venue_id: '' })}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:text-danger-600 hover:bg-danger-50 border border-surface-200 hover:border-danger-200 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}
