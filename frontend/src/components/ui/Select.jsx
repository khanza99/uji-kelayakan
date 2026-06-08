import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select...', className = '', ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full bg-white border rounded-xl
          px-3.5 py-2.5 text-sm text-surface-900
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-50
          appearance-none bg-no-repeat
          ${error
            ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/15'
            : 'border-surface-200 hover:border-surface-300'
          }
          ${className}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25em 1.25em',
          paddingRight: '2.5rem',
        }}
        {...props}
      >
        <option value="" className="text-surface-400">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
    </div>
  );
});

export default Select;
