const colorMap = {
  success: 'bg-success-50  text-success-700  border-success-200',
  warning: 'bg-warning-50  text-warning-700  border-warning-200',
  danger:  'bg-danger-50   text-danger-700   border-danger-200',
  info:    'bg-primary-50  text-primary-700  border-primary-200',
  gray:    'bg-surface-100 text-surface-600  border-surface-200',
  primary: 'bg-primary-50  text-primary-700  border-primary-200',
  accent:  'bg-primary-50  text-primary-700  border-primary-200',
};

const dotColorMap = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger:  'bg-danger-500',
  info:    'bg-primary-500',
  gray:    'bg-surface-400',
  primary: 'bg-primary-600',
  accent:  'bg-primary-600',
};

const sizes = {
  sm: 'px-2   py-0.5 text-[10px] font-semibold',
  md: 'px-2.5 py-0.5 text-xs    font-medium',
  lg: 'px-3   py-1   text-sm    font-medium',
};

export default function Badge({
  children,
  color = 'gray',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border
        ${colorMap[color] ?? colorMap.gray}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColorMap[color] ?? dotColorMap.gray}`} />
      )}
      {children}
    </span>
  );
}
