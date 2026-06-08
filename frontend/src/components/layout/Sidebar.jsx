import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

/* ── inline SVG icon helpers ── */
const icons = {
  dashboard: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 6a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5zM4 13a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
    </svg>
  ),
  concert: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  ticket: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  ),
  order: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  payment: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  refund: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
    </svg>
  ),
  scan: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  ),
  users: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  venue: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  category: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  seat: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  document: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  export: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

function NavItem({ to, icon: Icon, label, isActive }) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-150 group
        ${isActive
          ? 'bg-primary-50 text-primary-700 border border-primary-100'
          : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 border border-transparent'
        }
      `}
    >
      <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-primary-600' : 'text-surface-400 group-hover:text-surface-600'}`}
        style={{ width: '1.125rem', height: '1.125rem' }} />
      <span className="truncate">{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
      )}
    </Link>
  );
}

function NavSection({ title, children }) {
  return (
    <div className="mb-5">
      <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-surface-400">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const { hasRole } = useAuthStore();
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-surface-200 bg-white overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-surface-100 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm shadow-primary-600/20 group-hover:bg-primary-700 transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <span className="text-lg font-bold font-display text-surface-900 tracking-tight">
            Tix<span className="text-primary-600">Event</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 pt-4">
        {/* User Menu */}
        {hasRole('user') && (
          <NavSection title="My Account">
            <NavItem to="/my-orders"   icon={icons.order}   label="My Orders"  isActive={isActive('/my-orders')} />
            <NavItem to="/my-tickets"  icon={icons.ticket}  label="My Tickets" isActive={isActive('/my-tickets')} />
            <NavItem to="/my-payments" icon={icons.payment} label="Payments"   isActive={isActive('/my-payments')} />
            <NavItem to="/my-refunds"  icon={icons.refund}  label="Refunds"    isActive={isActive('/my-refunds')} />
          </NavSection>
        )}

        {/* Staff Menu */}
        {hasRole('staff') && (
          <NavSection title="Staff">
            <NavItem to="/staff/scan"      icon={icons.scan}     label="Scan Ticket"    isActive={isActive('/staff/scan')} />
            <NavItem to="/staff/orders"    icon={icons.order}    label="Orders"         isActive={isActive('/staff/orders')} />
            <NavItem to="/staff/refunds"   icon={icons.refund}   label="Refunds"        isActive={isActive('/staff/refunds')} />
            <NavItem to="/staff/documents" icon={icons.document} label="Documents"      isActive={isActive('/staff/documents')} />
          </NavSection>
        )}

        {/* Admin Menu */}
        {hasRole('superadmin') && (
          <NavSection title="Admin">
            <NavItem to="/admin/dashboard"  icon={icons.dashboard} label="Dashboard"   isActive={isActive('/admin/dashboard')} />
            <NavItem to="/admin/concerts"   icon={icons.concert}   label="Concerts"    isActive={isActive('/admin/concerts')} />
            <NavItem to="/admin/venues"     icon={icons.venue}     label="Venues"      isActive={isActive('/admin/venues')} />
            <NavItem to="/admin/categories" icon={icons.category}  label="Categories"  isActive={isActive('/admin/categories')} />
            <NavItem to="/admin/seat-tiers" icon={icons.seat}      label="Seat Tiers"  isActive={isActive('/admin/seat-tiers')} />
            <NavItem to="/admin/seats"      icon={icons.seat}      label="Seats"       isActive={isActive('/admin/seats')} />
            <NavItem to="/admin/users"      icon={icons.users}     label="Users"       isActive={isActive('/admin/users')} />
            <NavItem to="/admin/export"     icon={icons.export}    label="Export"      isActive={isActive('/admin/export')} />
          </NavSection>
        )}
      </nav>

      {/* Browse public site */}
      <div className="p-3 border-t border-surface-100 shrink-0">
        <Link
          to="/concerts"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-all group"
        >
          <svg className="w-4 h-4 text-surface-400 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Browse Events
        </Link>
      </div>
    </aside>
  );
}
