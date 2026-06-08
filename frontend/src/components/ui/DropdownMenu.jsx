import { useState, useRef, useEffect } from 'react';

export default function DropdownMenu({ trigger, items, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <div
          className={`
            absolute z-50 mt-2 w-52
            bg-white border border-surface-100 rounded-2xl
            shadow-xl shadow-surface-900/8
            animate-scale-in overflow-hidden
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          <div className="py-1.5">
            {items.map((item, i) =>
              item.divider ? (
                <div key={i} className="my-1 border-t border-surface-100" />
              ) : (
                <button
                  key={i}
                  onClick={() => { item.onClick?.(); setOpen(false); }}
                  className={`
                    w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left
                    transition-colors
                    ${item.danger
                      ? 'text-danger-600 hover:bg-danger-50'
                      : 'text-surface-700 hover:text-surface-900 hover:bg-surface-50'
                    }
                  `}
                >
                  {item.icon && <item.icon className="h-4 w-4 shrink-0 text-surface-400" />}
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
