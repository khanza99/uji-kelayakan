export default function EmptyState({
  icon,
  title = 'No data found',
  description,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-4 ${className}`}>
      {icon ? (
        <div className="mb-4 text-surface-300">{icon}</div>
      ) : (
        <div className="mb-5 w-16 h-16 rounded-2xl bg-surface-50 border border-surface-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="text-base font-semibold text-surface-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-surface-400 text-center max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
