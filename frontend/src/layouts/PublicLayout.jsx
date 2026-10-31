import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/public/PublicNavbar';
import Footer from '../components/public/Footer';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
