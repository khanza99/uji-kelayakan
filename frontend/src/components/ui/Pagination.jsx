export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page } = meta;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;

    for (
      let i = Math.max(1, current_page - delta);
      i <= Math.min(last_page, current_page + delta);
      i++
    ) pages.push(i);

    if (pages[0] > 1) {
      if (pages[0] > 2) pages.unshift('...');
      pages.unshift(1);
    }
    if (pages[pages.length - 1] < last_page) {
      if (pages[pages.length - 1] < last_page - 1) pages.push('...');
      pages.push(last_page);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-surface-500">
        Page <span className="font-medium text-surface-700">{current_page}</span> of{' '}
        <span className="font-medium text-surface-700">{last_page}</span>
        {meta.total && (
          <span className="text-surface-400"> · {meta.total} results</span>
        )}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1}
          className="p-2 rounded-lg text-surface-500 hover:text-primary-600 hover:bg-primary-50
            border border-surface-200 hover:border-primary-200
            disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`dot-${i}`} className="px-2 text-surface-400 text-sm">···</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200
                ${page === current_page
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30 border border-primary-600'
                  : 'text-surface-600 hover:text-primary-600 hover:bg-primary-50 border border-surface-200 hover:border-primary-200'
                }
              `}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page >= last_page}
          className="p-2 rounded-lg text-surface-500 hover:text-primary-600 hover:bg-primary-50
            border border-surface-200 hover:border-primary-200
            disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
