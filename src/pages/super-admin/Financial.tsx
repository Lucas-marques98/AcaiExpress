import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard
} from 'lucide-react';
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
import { formatCurrency, cn } from '../../lib/utils';

const revenueData = [
  { name: 'Jan', revenue: 4500, setup: 1200 },
  { name: 'Fev', revenue: 5200, setup: 800 },
  { name: 'Mar', revenue: 4800, setup: 1500 },
  { name: 'Abr', revenue: 6100, setup: 2100 },
  { name: 'Mai', revenue: 5900, setup: 1100 },
  { name: 'Jun', revenue: 7200, setup: 1800 },
];

export const SuperAdminFinancial: React.FC = () => {
  const { subscriptions, billingRecords, stores } = useStore();

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const mrr = activeSubscriptions.reduce((acc, curr) => acc + curr.monthlyFee, 0);
  const totalSetupRevenue = billingRecords.filter(r => r.type === 'setup' && r.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalRevenue = billingRecords.filter(r => r.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const overdueRevenue = billingRecords.filter(r => r.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);

  const getStoreName = (storeId: string) => stores.find(s => s.id === storeId)?.name || 'Loja não encontrada';

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Gestão Financeira</h1>
            <p className="text-gray-500 font-medium">Acompanhe a saúde financeira da plataforma SaaS.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl font-bold text-sm hover:bg-gray-50 transition-all premium-shadow">
            <Download className="w-4 h-4" /> Exportar Relatório
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Filter className="w-4 h-4" /> Filtrar Período
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border premium-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-16 h-16 text-primary" />
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">MRR Estimado</p>
          <p className="text-3xl font-black text-gray-900">{formatCurrency(mrr)}</p>
          <div className="flex items-center gap-1 mt-2 text-green-500 font-bold text-xs">
            <ArrowUpRight className="w-3 h-3" /> +12.5% vs mês anterior
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border premium-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign className="w-16 h-16 text-green-600" />
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Receita Total (Paga)</p>
          <p className="text-3xl font-black text-gray-900">{formatCurrency(totalRevenue)}</p>
          <div className="flex items-center gap-1 mt-2 text-green-500 font-bold text-xs">
            <ArrowUpRight className="w-3 h-3" /> +8.2% vs mês anterior
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border premium-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <CreditCard className="w-16 h-16 text-blue-600" />
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Setup (Pago)</p>
          <p className="text-3xl font-black text-gray-900">{formatCurrency(totalSetupRevenue)}</p>
          <div className="flex items-center gap-1 mt-2 text-blue-500 font-bold text-xs">
            <ArrowUpRight className="w-3 h-3" /> 4 novas implantações
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border premium-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Inadimplência</p>
          <p className="text-3xl font-black text-red-600">{formatCurrency(overdueRevenue)}</p>
          <div className="flex items-center gap-1 mt-2 text-red-500 font-bold text-xs">
            <ArrowDownRight className="w-3 h-3" /> 3 lojas com atraso
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border premium-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900">Crescimento de Receita</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-xs font-bold text-gray-500">Mensalidades</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs font-bold text-gray-500">Setups</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b21a8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6b21a8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSetup" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '1rem', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                  itemStyle={{ fontWeight: 900 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6b21a8" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="setup" stroke="#22c55e" strokeWidth={4} fillOpacity={1} fill="url(#colorSetup)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border premium-shadow">
          <h3 className="text-xl font-black text-gray-900 mb-6">Cobranças Recentes</h3>
          <div className="space-y-6">
            {billingRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    record.status === 'paid' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {record.status === 'paid' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 group-hover:text-primary transition-colors">{getStoreName(record.storeId)}</p>
                    <p className="text-xs font-bold text-gray-400 capitalize">{record.type === 'monthly' ? 'Mensalidade' : 'Taxa de Setup'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900">{formatCurrency(record.amount)}</p>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    record.status === 'paid' ? "text-green-500" : "text-amber-500"
                  )}>
                    {record.status === 'paid' ? 'Pago' : 'Pendente'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-black text-sm transition-all">
            Ver Todo o Histórico
          </button>
        </div>
      </div>
    </div>
  );
};
