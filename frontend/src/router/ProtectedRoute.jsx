import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, hasAnyRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !hasAnyRole(...roles)) {
    // Dynamic redirect based on user's actual role to prevent infinite loops
    const roleName = useAuthStore.getState().user?.roles?.[0]?.name || useAuthStore.getState().user?.role || 'user';
    if (roleName === 'superadmin') return <Navigate to="/admin/dashboard" replace />;
    if (roleName === 'staff') return <Navigate to="/staff/scan" replace />;
    return <Navigate to="/my-orders" replace />;
  }

  return children;
}
