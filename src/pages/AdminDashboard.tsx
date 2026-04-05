import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, cn } from '../lib/utils';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Vendas Hoje', value: formatCurrency(1240.50), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Pedidos Pendentes', value: '12', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Novos Clientes', value: '24', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Ticket Médio', value: formatCurrency(32.40), icon: ArrowUpRight, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
        <div className="p-8 border-b">
          <h1 className="font-black text-xl text-primary">Açaí Admin</h1>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Dashboard Pro</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { label: 'Dashboard', icon: LayoutDashboard, active: true },
            { label: 'Pedidos', icon: ShoppingBag },
            { label: 'Produtos', icon: Package },
            { label: 'Categorias', icon: Layers },
            { label: 'Configurações', icon: Settings },
          ].map((item, i) => (
            <button
              key={i}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={() => { logout(); navigate('/admin'); }}
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
              <h2 className="text-3xl font-black text-gray-900">Dashboard</h2>
              <p className="text-gray-500 font-medium">Bem-vindo de volta, Lucas!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-xl border font-bold text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Loja Aberta
              </div>
              <img src="https://ui-avatars.com/api/?name=Lucas+Rodrigues&background=6b21a8&color=fff" className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg" />
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="bg-white p-6 rounded-[2rem] premium-shadow"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <section className="bg-white rounded-[2.5rem] premium-shadow overflow-hidden">
            <div className="p-8 border-b flex items-center justify-between">
              <h3 className="text-xl font-black">Pedidos Recentes</h3>
              <button className="text-primary font-bold text-sm">Ver todos</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-black text-gray-400">
                    <th className="px-8 py-4">ID</th>
                    <th className="px-8 py-4">Cliente</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Total</th>
                    <th className="px-8 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { id: '#1234', customer: 'João Silva', status: 'preparing', total: 45.90 },
                    { id: '#1235', customer: 'Maria Oliveira', status: 'pending', total: 32.00 },
                    { id: '#1236', customer: 'Pedro Santos', status: 'completed', total: 18.50 },
                    { id: '#1237', customer: 'Ana Costa', status: 'cancelled', total: 55.00 },
                  ].map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-bold text-gray-400">{order.id}</td>
                      <td className="px-8 py-6 font-bold text-gray-900">{order.customer}</td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                          order.status === 'preparing' ? "bg-orange-100 text-orange-600" :
                          order.status === 'pending' ? "bg-blue-100 text-blue-600" :
                          order.status === 'completed' ? "bg-green-100 text-green-600" :
                          "bg-red-100 text-red-600"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-primary">{formatCurrency(order.total)}</td>
                      <td className="px-8 py-6">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <ArrowUpRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
