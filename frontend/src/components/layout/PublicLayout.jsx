import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  const location = useLocation();
  // Homepage has a full-bleed hero that sits under the transparent navbar.
  // All other public pages start below the fixed navbar.
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className={`flex-1 ${isHome ? '' : 'pt-16'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
