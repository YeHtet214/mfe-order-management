
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout/MainLayout';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';
import OrderListPage from './pages/orders/OrderListPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import OrderCreatePage from './pages/orders/OrderCreatePage';
import OrderEditPage from './pages/orders/OrderEditPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/create" element={<OrderCreatePage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/orders/:id/edit" element={<OrderEditPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<Navigate to="/orders" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/orders" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
