const variants = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md shadow-primary-600/20',
  secondary:
    'bg-white hover:bg-surface-50 text-surface-700 border border-surface-200 hover:border-surface-300 shadow-sm',
  cta:
    'bg-cta-500 hover:bg-cta-600 text-white shadow-sm hover:shadow-md shadow-cta-500/25 font-semibold',
  accent:
    'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-sm hover:shadow-md shadow-primary-600/20',
  danger:
    'bg-danger-600 hover:bg-danger-700 text-white shadow-sm shadow-danger-600/20',
  success:
    'bg-success-600 hover:bg-success-700 text-white shadow-sm shadow-success-600/20',
  ghost:
    'bg-transparent hover:bg-surface-100 text-surface-600 hover:text-surface-900',
  outline:
    'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50',
  'outline-gray':
    'bg-transparent border border-surface-200 text-surface-600 hover:bg-surface-50 hover:border-surface-300',
};

const sizes = {
  xs:  'px-2.5 py-1    text-xs  rounded-lg  gap-1',
  sm:  'px-3.5 py-1.5  text-sm  rounded-lg  gap-1.5',
  md:  'px-4.5 py-2    text-sm  rounded-xl  gap-2',
  lg:  'px-6   py-2.5  text-base rounded-xl gap-2',
  xl:  'px-8   py-3.5  text-base rounded-2xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  outline,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-2 focus:ring-offset-white
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.97]
        ${variants[variant] ?? variants.primary}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="h-4 w-4 shrink-0" />}
    </button>
  );
}
