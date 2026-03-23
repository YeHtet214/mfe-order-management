import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { UnauthorizedPage } from "./pages/auth/UnauthorizedPage";
import { ProductListPage } from "./pages/products/ProductListPage";
import { ProductCreatePage } from "./pages/products/ProductCreatePage";
import { ProductEditPage } from "./pages/products/ProductEditPage";
import { ProductDetailPage } from "./pages/products/ProductDetailPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Main App Routes - Protected */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/profile" element={<ProfilePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/create" element={<ProductCreatePage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/edit" element={<ProductEditPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
