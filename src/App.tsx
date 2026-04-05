import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { ProductDetail } from './pages/ProductDetail';
import { Success } from './pages/Success';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLogin } from './pages/AdminLogin';
import {
  Dashboard,
  Orders,
  Products,
  Categories,
  Addons,
  Banners,
  Promotions,
  Coupons,
  OpeningHours,
  Customers,
  Settings
} from './pages/admin';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <Routes>
              {/* Public Area */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cardapio" element={<Home />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pedido/sucesso" element={<Success />} />
              </Route>

              {/* Admin Area */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Redirect /admin to dashboard or login via ProtectedRoute */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pedidos" element={<Orders />} />
                <Route path="produtos" element={<Products />} />
                <Route path="categorias" element={<Categories />} />
                <Route path="adicionais" element={<Addons />} />
                <Route path="banners" element={<Banners />} />
                <Route path="promocoes" element={<Promotions />} />
                <Route path="cupons" element={<Coupons />} />
                <Route path="horarios" element={<OpeningHours />} />
                <Route path="clientes" element={<Customers />} />
                <Route path="configuracoes" element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster position="top-center" richColors />
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  );
}
