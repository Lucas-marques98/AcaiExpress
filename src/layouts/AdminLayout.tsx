import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  Percent
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
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
    { path: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b">
          <h1 className="font-black text-xl text-primary">Açaí Express</h1>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Painel Pro</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={() => { logout(); navigate('/admin/login'); }}
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
              <h2 className="text-3xl font-black text-gray-900">Painel Administrativo</h2>
              <p className="text-gray-500 font-medium">Gerencie seu negócio de forma profissional.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-xl border font-bold text-sm flex items-center gap-2 premium-shadow">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Loja Aberta
              </div>
              <img src="https://ui-avatars.com/api/?name=Admin&background=6b21a8&color=fff" className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg" alt="Avatar" />
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
