export default function Card({
  children,
  className = '',
  hover = false,
  padding = true,
  ...props
}) {
  return (
    <div
      className={`
        bg-white border border-surface-100 rounded-2xl card-shadow
        ${padding ? 'p-5' : ''}
        ${hover
          ? 'hover:border-primary-100 hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5 cursor-pointer'
          : ''
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`pb-4 border-b border-surface-100 ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`py-4 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`pt-4 border-t border-surface-100 ${className}`}>
      {children}
    </div>
  );
};
