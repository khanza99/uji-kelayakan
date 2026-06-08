import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import useAuthStore from '@/store/authStore';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import ConcertListPage from '@/pages/public/ConcertListPage';
import ConcertDetailPage from '@/pages/public/ConcertDetailPage';

// User Pages
import MyOrdersPage from '@/pages/user/MyOrdersPage';
import OrderDetailPage from '@/pages/user/OrderDetailPage';
import MyTicketsPage from '@/pages/user/MyTicketsPage';
import TicketDetailPage from '@/pages/user/TicketDetailPage';
import MyPaymentsPage from '@/pages/user/MyPaymentsPage';
import MyRefundsPage from '@/pages/user/MyRefundsPage';
import CheckoutPage from '@/pages/user/CheckoutPage';

// Staff Pages
import ScanTicketPage from '@/pages/staff/ScanTicketPage';
import ManageOrdersPage from '@/pages/staff/ManageOrdersPage';
import ManageRefundsPage from '@/pages/staff/ManageRefundsPage';
import ManageDocumentsPage from '@/pages/staff/ManageDocumentsPage';

// Admin Pages
import DashboardPage from '@/pages/admin/DashboardPage';
import ManageConcertsPage from '@/pages/admin/ManageConcertsPage';
import ManageVenuesPage from '@/pages/admin/ManageVenuesPage';
import ManageCategoriesPage from '@/pages/admin/ManageCategoriesPage';
import ManageSeatTiersPage from '@/pages/admin/ManageSeatTiersPage';
import ManageSeatsPage from '@/pages/admin/ManageSeatsPage';
import ManageUsersPage from '@/pages/admin/ManageUsersPage';
import ExportPage from '@/pages/admin/ExportPage';

const RoleRedirector = () => {
  const user = useAuthStore.getState().user;
  const roleName = user?.roles?.[0]?.name || user?.role || 'user';
  if (roleName === 'superadmin') return <Navigate to="/admin/dashboard" replace />;
  if (roleName === 'staff') return <Navigate to="/staff/scan" replace />;
  return <Navigate to="/my-orders" replace />;
};

const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/concerts', element: <ConcertListPage /> },
      { path: '/concerts/:id', element: <ConcertDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // Authenticated routes (any role)
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // Default redirect
      { path: '/dashboard', element: <RoleRedirector /> },

      // User routes
      {
        path: '/my-orders',
        element: (
          <ProtectedRoute roles={['user']}>
            <MyOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-orders/:id',
        element: (
          <ProtectedRoute roles={['user']}>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-tickets',
        element: (
          <ProtectedRoute roles={['user']}>
            <MyTicketsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-tickets/:id',
        element: (
          <ProtectedRoute roles={['user']}>
            <TicketDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-payments',
        element: (
          <ProtectedRoute roles={['user']}>
            <MyPaymentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-refunds',
        element: (
          <ProtectedRoute roles={['user']}>
            <MyRefundsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute roles={['user']}>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },

      // Staff routes
      {
        path: '/staff/scan',
        element: (
          <ProtectedRoute roles={['staff']}>
            <ScanTicketPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/staff/orders',
        element: (
          <ProtectedRoute roles={['staff']}>
            <ManageOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/staff/refunds',
        element: (
          <ProtectedRoute roles={['staff']}>
            <ManageRefundsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/staff/documents',
        element: (
          <ProtectedRoute roles={['staff']}>
            <ManageDocumentsPage />
          </ProtectedRoute>
        ),
      },

      // Admin routes
      {
        path: '/admin/dashboard',
        element: (
          <ProtectedRoute roles={['superadmin']}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/concerts',
        element: (
          <ProtectedRoute roles={['superadmin']}>
            <ManageConcertsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/venues',
        element: (
          <ProtectedRoute roles={['superadmin']}>
            <ManageVenuesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/categories',
        element: (
          <ProtectedRoute roles={['superadmin']}>
            <ManageCategoriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/seat-tiers',
        element: (
          <ProtectedRoute roles={['superadmin']}>
            <ManageSeatTiersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/seats',
        element: (
          <ProtectedRoute roles={['superadmin']}>
            <ManageSeatsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/users',
        element: (
          <ProtectedRoute roles={['superadmin']}>
            <ManageUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/export',
        element: (
          <ProtectedRoute roles={['superadmin']}>
            <ExportPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
