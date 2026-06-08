import { forwardRef } from 'react';

const TextArea = forwardRef(function TextArea(
  { label, error, hint, className = '', rows = 4, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full bg-white border rounded-xl
          px-3.5 py-2.5 text-sm text-surface-900 placeholder-surface-400
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15
          transition-all duration-200 resize-y
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-50
          ${error
            ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/15'
            : 'border-surface-200 hover:border-surface-300'
          }
          ${className}
        `}
        {...props}
      />
      {hint && !error && (
        <p className="mt-1.5 text-xs text-surface-400">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-danger-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

export default TextArea;
