import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Settings, 
  LogOut, 
  Users, 
  Clock,
  Image as ImageIcon,
  Plus,
  Ticket,
  Percent,
  Store as StoreIcon,
  ShieldAlert,
  CreditCard,
  TrendingUp,
  ClipboardList,
  ShieldCheck,
  Zap,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';

import { SubscriptionBlocker } from '../components/admin/SubscriptionBlocker';

export const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { setStoreById, currentStore, loading } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (user?.role === 'STORE_ADMIN' && user.storeId) {
      setStoreById(user.storeId);
    }
  }, [user, setStoreById]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const storeMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { path: '/admin/produtos', label: 'Produtos', icon: Package },
    { path: '/admin/categorias', label: 'Categorias', icon: Layers },
    { path: '/admin/adicionais', label: 'Adicionais', icon: Plus },
    { path: '/admin/banners', label: 'Banners', icon: ImageIcon },
    { path: '/admin/promocoes', label: 'Promoções', icon: Percent },
    { path: '/admin/cupons', label: 'Cupons', icon: Ticket },
    { path: '/admin/horarios', label: 'Horários', icon: Clock },
    { path: '/admin/clientes', label: 'Clientes', icon: Users },
    { path: '/admin/meu-plano', label: 'Meu Plano', icon: ShieldCheck },
    { path: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  ];

  const superAdminMenuItems = [
    { path: '/menu-flex-admin/dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
    { path: '/menu-flex-admin/lojas', label: 'Gerenciar Lojas', icon: StoreIcon },
    { path: '/menu-flex-admin/assinaturas', label: 'Assinaturas', icon: CreditCard },
    { path: '/menu-flex-admin/financeiro', label: 'Financeiro', icon: TrendingUp },
    { path: '/menu-flex-admin/onboarding', label: 'Implantações', icon: ClipboardList },
    { path: '/menu-flex-admin/planos', label: 'Planos SaaS', icon: ShieldAlert },
    { path: '/menu-flex-admin/settings', label: 'Configurações SaaS', icon: Settings },
  ];

  const menuItems = isSuperAdmin && location.pathname.startsWith('/menu-flex-admin') 
    ? superAdminMenuItems 
    : storeMenuItems;

  // Subscription check for Store Admin
  const billingStatus = currentStore?.billingStatus || 'active';
  const isSuspended = !isSuperAdmin && currentStore && (currentStore.status === 'suspended' || billingStatus === 'suspended');
  const isOverdue = !isSuperAdmin && currentStore && billingStatus === 'overdue';
  const isTrial = !isSuperAdmin && currentStore && billingStatus === 'trial';
  const isCanceled = !isSuperAdmin && currentStore && (currentStore.status === 'canceled' || billingStatus === 'canceled');

  // Block dashboard and menu for suspended or canceled
  const isBlocked = isSuspended || isCanceled;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b">
          <Link to="/" className="flex items-center gap-2 mb-2 group">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              MenuX <span className="text-purple-600">Flex</span>
            </span>
          </Link>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            {isSuperAdmin ? 'Super Administrador' : (currentStore?.name || 'Gestão da Loja')}
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                isActive ? "bg-purple-600 text-white shadow-lg shadow-purple-200" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2">
          {isSuperAdmin && !location.pathname.startsWith('/menu-flex-admin') && (
            <button 
              onClick={() => navigate('/menu-flex-admin/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-purple-600 hover:bg-purple-50 transition-all"
            >
              <ShieldAlert className="w-5 h-5" />
              Voltar ao Super Admin
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900">
                {isSuperAdmin && location.pathname.startsWith('/menu-flex-admin') ? 'Visão Geral da Plataforma' : 'Painel Administrativo'}
              </h2>
              <p className="text-gray-500 font-medium">
                {isSuperAdmin && location.pathname.startsWith('/menu-flex-admin') 
                  ? 'Gerencie todas as lojas e métricas do sistema.' 
                  : `Gerencie a operação da ${currentStore?.name || 'sua loja'}.`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isTrial && (
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 font-bold text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Período de Teste
                </div>
              )}
              {isOverdue && (
                <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 font-bold text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Pagamento Pendente
                </div>
              )}
              {!isSuperAdmin && currentStore && (
                <div className="bg-white px-4 py-2 rounded-xl border font-bold text-sm flex items-center gap-2 shadow-sm">
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", currentStore.isOpen ? "bg-green-500" : "bg-red-500")} />
                  {currentStore.isOpen ? 'Loja Aberta' : 'Loja Fechada'}
                </div>
              )}
              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-gray-900">{user?.name}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role}</span>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=6b21a8&color=fff`} className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg" alt="Avatar" />
            </div>
          </header>

          {isBlocked ? (
            <SubscriptionBlocker 
              status={isSuspended ? 'suspended' : 'canceled'} 
              storeName={currentStore?.name || 'sua loja'} 
            />
          ) : isOverdue && location.pathname !== '/admin/meu-plano' && location.pathname !== '/admin/configuracoes' ? (
            <SubscriptionBlocker 
              status="overdue" 
              storeName={currentStore?.name || 'sua loja'} 
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};
