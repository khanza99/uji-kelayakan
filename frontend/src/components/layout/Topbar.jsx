import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { logout as logoutApi } from '@/api/authApi';
import Avatar from '@/components/ui/Avatar';
import DropdownMenu from '@/components/ui/DropdownMenu';
import toast from 'react-hot-toast';

export default function Topbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore error — clear locally regardless
    }
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const roleName = user?.roles?.[0]?.name || user?.role || 'user';

  return (
    <header className="relative z-40 h-16 shrink-0 border-b border-surface-800 bg-surface-950/80 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Left — Page breadcrumb area */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-surface-300">
          Welcome back, <span className="text-white font-semibold">{user?.name || 'User'}</span>
        </h2>
      </div>

      {/* Right — User menu */}
      <div className="flex items-center gap-4">
        {/* Role badge */}
        <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-500/10 text-primary-400 border border-primary-500/20">
          {roleName}
        </span>

        {/* User dropdown */}
        <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-800 transition-colors">
              <Avatar name={user?.name} size="sm" />
              <svg className="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          }
          items={[
            {
              label: user?.name || 'User',
              onClick: () => {},
            },
            {
              label: user?.email || '',
              onClick: () => {},
            },
            { divider: true },
            {
              label: 'Browse Concerts',
              onClick: () => navigate('/concerts'),
            },
            { divider: true },
            {
              label: 'Logout',
              onClick: handleLogout,
              danger: true,
            },
          ]}
        />
      </div>
    </header>
  );
}
