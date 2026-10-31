import { Outlet } from 'react-router-dom';
import AdminTopNav from '../components/admin/AdminTopNav';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-cream">
      <AdminTopNav />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
