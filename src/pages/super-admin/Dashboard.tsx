import React, { useState } from 'react';
import { 
  Users, 
  Store, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  DollarSign,
  Plus,
  ClipboardList,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { StoreModal } from '../../components/super-admin/StoreModal';
import { toast } from 'sonner';

const data = [
  { name: 'Jan', receita: 4000, lojas: 24 },
  { name: 'Fev', receita: 3000, lojas: 28 },
  { name: 'Mar', receita: 2000, lojas: 35 },
  { name: 'Abr', receita: 2780, lojas: 42 },
  { name: 'Mai', receita: 1890, lojas: 48 },
  { name: 'Jun', receita: 2390, lojas: 55 },
];

export const SuperAdminDashboard: React.FC = () => {
  const { stores, plans, addStore, subscriptions, onboardingChecklists } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveStore = (storeData: any) => {
    addStore(storeData);
    toast.success(`Loja ${storeData.name} criada com sucesso!`);
  };

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const mrr = activeSubscriptions.reduce((acc, curr) => acc + curr.monthlyFee, 0);
  const pendingOnboarding = onboardingChecklists.filter(o => o.status !== 'completed').length;

  const stats = [
    { 
      label: 'Total de Lojas', 
      value: stores.length, 
      change: '+12%', 
      trend: 'up', 
      icon: Store, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Implantações', 
      value: pendingOnboarding, 
      change: '4 urgentes', 
      trend: 'down', 
      icon: Activity, 
      color: 'bg-amber-500' 
    },
    { 
      label: 'Receita Mensal (MRR)', 
      value: formatCurrency(mrr), 
      change: '+18%', 
      trend: 'up', 
      icon: DollarSign, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Inadimplência', 
      value: subscriptions.filter(s => s.status === 'overdue').length, 
      change: '-2%', 
      trend: 'down', 
      icon: Users, 
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dashboard Geral</h1>
          <p className="text-gray-500 font-medium">Visão geral da plataforma SaaS</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-200"
        >
          <Plus className="w-5 h-5" />
          Nova Loja
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">Crescimento de Receita</h3>
              <p className="text-gray-500 text-sm font-medium">Evolução do faturamento mensal da plataforma.</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-purple-600 rounded-lg shadow-sm">MRR</button>
              <button className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">ARR</button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b21a8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6b21a8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#6b21a8" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorReceita)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stores Growth Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">Novas Lojas</h3>
              <p className="text-gray-500 text-sm font-medium">Adesão de novos lojistas por mês.</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Bar 
                  dataKey="lojas" 
                  fill="#6b21a8" 
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Stores and Onboarding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">Lojas Recentes</h3>
              <p className="text-gray-500 text-sm font-medium">Últimos lojistas que entraram na plataforma.</p>
            </div>
            <button className="text-purple-600 font-bold text-sm hover:underline">Ver todas as lojas</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loja</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Plano</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stores.slice(0, 5).map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <img src={store.logo} className="w-10 h-10 rounded-xl object-contain bg-gray-50 p-1 border" alt={store.name} />
                        <div>
                          <p className="font-bold text-gray-900">{store.name}</p>
                          <p className="text-xs text-gray-400 font-medium">/{store.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-600">
                          {plans.find(p => p.id === store.planId)?.name || 'Nenhum'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        store.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {store.status === 'active' ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                        <TrendingUp className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900">Implantações</h3>
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
              {onboardingChecklists.filter(o => o.status !== 'completed').length} Pendentes
            </span>
          </div>
          <div className="space-y-6">
            {onboardingChecklists.filter(o => o.status !== 'completed').slice(0, 4).map((ob) => (
              <div key={ob.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <ClipboardList className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm group-hover:text-primary transition-colors">
                      {stores.find(s => s.id === ob.storeId)?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${(ob.items.filter(i => i.completed).length / ob.items.length) * 100}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">
                        {Math.round((ob.items.filter(i => i.completed).length / ob.items.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-300 hover:text-gray-600">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-black text-sm transition-all">
            Ver Todas as Implantações
          </button>
        </div>
      </div>

      <StoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStore}
        plans={plans}
      />
    </div>
  );
};
