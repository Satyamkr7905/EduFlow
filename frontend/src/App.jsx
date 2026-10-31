import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import { ProtectedRoute, GuestRoute } from './components/routing/RouteGuards';
import ScrollManager from './components/routing/ScrollManager';
import { PageLoader } from './components/ui/Feedback';

import Home from './pages/public/Home';
import Inquire from './pages/public/Inquire';
import Login from './pages/admin/Login';
import NotFound from './pages/NotFound';

// Admin pages are code-split – visitors never download dashboard/chart code.
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const Settings = lazy(() => import('./pages/admin/Settings'));

export default function App() {
  const location = useLocation();
  // Animate between top-level sections only (public ↔ admin), not every nested route.
  const sectionKey = location.pathname.startsWith('/admin') ? 'admin' : 'public';

  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={sectionKey}>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="inquire" element={<Inquire />} />
            </Route>

            <Route
              path="/admin/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/login" element={<Navigate to="/admin/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}
