import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/RouteGuard';
import DashboardLayout from './components/DashboardLayout';

import Landing   from './pages/Landing';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants   from './pages/Tenants';
import Leases    from './pages/Leases';
import Payments  from './pages/Payments';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Inter, sans-serif', fontSize: 14, borderRadius: 10 },
            success: { iconTheme: { primary: '#16A34A', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<Landing />} />

          {/* Auth pages — redirect to dashboard if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/tenants"    element={<Tenants />} />
              <Route path="/leases"     element={<Leases />} />
              <Route path="/payments"   element={<Payments />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
