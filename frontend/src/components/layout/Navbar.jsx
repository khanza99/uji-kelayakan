import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export default function Navbar() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => { clearAuth(); navigate('/login'); };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    const role = user.roles?.[0]?.name || user.role;
    if (role === 'superadmin' || role === 'staff') return '/admin/dashboard';
    return '/my-orders';
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/concerts', label: 'Events' },
  ];

  // Navbar always white
  const isTransparent = false;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-white/95 backdrop-blur-xl border-b border-surface-100 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105 ${
              isTransparent
                ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                : 'bg-primary-600 shadow-primary-600/25'
            }`}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className={`text-xl font-bold font-display tracking-tight ${isTransparent ? 'text-white' : 'text-surface-900'}`}>
              Tix<span className={isTransparent ? 'text-white/80' : 'text-primary-600'}>Event</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isTransparent
                      ? active
                        ? 'text-white bg-white/15'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      : active
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                  }`}
                >
                  {link.label}
                  {active && !isTransparent && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-600" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right: auth ── */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <>
                {/* Dashboard shortcut */}
                <Link
                  to={getDashboardPath()}
                  className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </Link>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl transition-all duration-200 ${
                      isTransparent
                        ? 'bg-white/15 hover:bg-white/25 border border-white/20'
                        : 'bg-surface-50 hover:bg-surface-100 border border-surface-200'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className={`hidden sm:block text-sm font-medium max-w-[90px] truncate ${
                      isTransparent ? 'text-white' : 'text-surface-800'
                    }`}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <svg className={`w-3.5 h-3.5 transition-transform ${profileOpen ? 'rotate-180' : ''} ${
                      isTransparent ? 'text-white/60' : 'text-surface-400'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-surface-100 rounded-2xl shadow-xl shadow-surface-900/10 py-1.5 animate-scale-in">
                      <div className="px-4 py-3 border-b border-surface-100">
                        <p className="text-sm font-semibold text-surface-900 truncate">{user?.name}</p>
                        <p className="text-xs text-surface-400 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { to: '/my-orders', label: 'My Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                          { to: '/my-tickets', label: 'My Tickets', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-surface-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hidden sm:block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isTransparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-surface-700 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-cta-500 hover:bg-cta-600 text-white transition-all shadow-sm shadow-cta-500/30 hover:shadow-md hover:-translate-y-px"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-surface-500 hover:text-surface-800 hover:bg-surface-100'
              }`}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-surface-100 shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const active = link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-50 text-primary-600 border border-primary-100'
                      : 'text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-surface-100 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-semibold text-surface-900">{user?.name}</p>
                    <p className="text-xs text-surface-400">{user?.email}</p>
                  </div>
                  {[
                    { to: getDashboardPath(), label: 'Dashboard' },
                    { to: '/my-orders', label: 'My Orders' },
                    { to: '/my-tickets', label: 'My Tickets' },
                  ].map((item) => (
                    <Link key={item.to} to={item.to}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-700 hover:bg-surface-50 transition-all">
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-danger-600 hover:bg-danger-50 transition-all mt-1"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-1">
                  <Link to="/login"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center border border-surface-200 text-surface-700 hover:bg-surface-50 transition-all">
                    Sign In
                  </Link>
                  <Link to="/register"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center bg-cta-500 hover:bg-cta-600 text-white transition-all">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
