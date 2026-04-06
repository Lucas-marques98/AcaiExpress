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
import { StoreLoader } from './components/StoreLoader';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { ProductDetail } from './pages/ProductDetail';
import { Success } from './pages/Success';
import { NotFoundPage } from './pages/NotFoundPage';
import { SignUp } from './pages/SignUp';

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
  Settings,
  MyPlan
} from './pages/admin';

// Super Admin Pages
import { SuperAdminDashboard } from './pages/super-admin/Dashboard';
import { SuperAdminStores } from './pages/super-admin/Stores';
import { SuperAdminPlans } from './pages/super-admin/Plans';
import { SuperAdminSubscriptions } from './pages/super-admin/Subscriptions';
import { SuperAdminFinancial } from './pages/super-admin/Financial';
import { SuperAdminOnboarding } from './pages/super-admin/Onboarding';
import { SuperAdminSettings } from './pages/super-admin/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <Routes>
                {/* Institutional Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Public Store Area */}
                <Route path="/loja/:slug" element={<StoreLoader />}>
                  <Route element={<PublicLayout />}>
                    <Route index element={<Home />} />
                    <Route path="cardapio" element={<Home />} />
                    <Route path="produto/:id" element={<ProductDetail />} />
                    <Route path="carrinho" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="pedido/sucesso" element={<Success />} />
                  </Route>
                </Route>

                {/* Admin Area */}
                <Route path="/cadastro" element={<SignUp />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}><AdminLayout /></ProtectedRoute>}>
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
                  <Route path="meu-plano" element={<MyPlan />} />
                  <Route path="configuracoes" element={<Settings />} />
                </Route>

                {/* Super Admin Area */}
                <Route path="/menu-flex-admin" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                  <Route path="lojas" element={<SuperAdminStores />} />
                  <Route path="planos" element={<SuperAdminPlans />} />
                  <Route path="assinaturas" element={<SuperAdminSubscriptions />} />
                  <Route path="financeiro" element={<SuperAdminFinancial />} />
                  <Route path="onboarding" element={<SuperAdminOnboarding />} />
                  <Route path="settings" element={<SuperAdminSettings />} />
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
