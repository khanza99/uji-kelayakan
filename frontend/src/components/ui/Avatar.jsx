const sizes = {
  xs: 'h-6  w-6  text-[9px]',
  sm: 'h-8  w-8  text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-surface-200 ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full flex items-center justify-center shrink-0
        bg-primary-600 text-white font-bold
        ring-2 ring-primary-100
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
