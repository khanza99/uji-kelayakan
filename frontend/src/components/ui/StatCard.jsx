export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = "primary",
  className = "",
}) {
  const isPositive = trend > 0;

  const colorMap = {
    primary: {
      bg: "bg-primary-50",
      text: "text-primary-600",
      ring: "ring-primary-100",
    },
    success: {
      bg: "bg-success-50",
      text: "text-success-600",
      ring: "ring-success-100",
    },
    warning: {
      bg: "bg-warning-50",
      text: "text-warning-600",
      ring: "ring-warning-100",
    },
    danger: {
      bg: "bg-danger-50",
      text: "text-danger-600",
      ring: "ring-danger-100",
    },
    cta: { bg: "bg-cta-50", text: "text-cta-600", ring: "ring-cta-100" },
  };

  const c = colorMap[color] ?? colorMap.primary;

  return (
    <div
      className={`
        relative overflow-hidden bg-white border border-surface-100 rounded-2xl p-5
        hover:border-primary-100 transition-all duration-200 group
        ${className}
      `}
      style={{
        boxShadow:
          "0 1px 4px rgba(0,0,0,0.04), 0 2px 12px rgba(37,99,235,0.04)",
      }}
    >
      {/* Subtle corner accent */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${c.bg} opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-1.5 truncate">
            {title}
          </p>
          <p className="text-xl font-black font-display text-surface-900 leading-none break-words">
            {value}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  isPositive  
                    ? "bg-success-50 text-success-700"
                    : "bg-danger-50 text-danger-700"
                }`}
              >
                {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="text-xs text-surface-400">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`shrink-0 w-11 h-11 rounded-2xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}
          >
            <Icon className={`h-5 w-5 ${c.text}`} />
          </div>
        )}
      </div>
    </div>
  );
}
