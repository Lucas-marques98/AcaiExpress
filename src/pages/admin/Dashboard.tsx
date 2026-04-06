import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency, cn } from '../../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate, Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { orders, currentStore } = useStore();
  const navigate = useNavigate();

  const isTrial = currentStore?.billingStatus === 'trial';
  const trialDaysLeft = useMemo(() => {
    if (!currentStore?.trialEndsAt) return 0;
    const diff = new Date(currentStore.trialEndsAt).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [currentStore]);

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const averageTicket = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      const revenue = dayOrders.reduce((acc, curr) => acc + curr.total, 0);
      return { name: dateStr, vendas: revenue };
    });

    return { totalRevenue, pendingOrders, completedOrders, averageTicket, chartData: last7Days };
  }, [orders]);

  const stats = [
    { label: 'Faturamento Total', value: formatCurrency(metrics.totalRevenue), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Pedidos Pendentes', value: metrics.pendingOrders.toString(), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Pedidos Concluídos', value: metrics.completedOrders.toString(), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Ticket Médio', value: formatCurrency(metrics.averageTicket), icon: ArrowUpRight, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      {isTrial && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-purple-200 dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Zap className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-black tracking-tight">Você está no Período de Teste</h4>
              <p className="text-white/80 font-medium">Sua degustação gratuita termina em <span className="text-white font-black">{trialDaysLeft} dias</span>. Não perca o acesso ao seu cardápio!</p>
            </div>
          </div>
          <Link 
            to="/admin/meu-plano"
            className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all shadow-lg whitespace-nowrap relative z-10"
          >
            Ativar Assinatura Agora
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white p-6 rounded-[2rem] premium-shadow border border-gray-50">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] premium-shadow p-8 border border-gray-50 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900">Desempenho Semanal</h3>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-purple-600 rounded-lg shadow-sm">Vendas</button>
              <button className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">Pedidos</button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '16px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                />
                <Line type="monotone" dataKey="vendas" stroke="#6b21a8" strokeWidth={5} dot={{ r: 6, strokeWidth: 3, fill: '#fff' }} activeDot={{ r: 10, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="space-y-8">
          {/* Subscription Status Widget */}
          <section className="bg-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {currentStore?.billingStatus === 'trial' ? 'Período de Teste' : 'Assinatura Ativa'}
                </span>
                <ShieldCheck className="w-6 h-6 text-white/80" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-bold mb-1">Próximo Vencimento</p>
                <p className="text-2xl font-black">
                  {currentStore?.nextBillingDate 
                    ? new Date(currentStore.nextBillingDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Não definido'}
                </p>
              </div>
              <button 
                onClick={() => navigate('/admin/meu-plano')}
                className="w-full py-4 bg-white text-purple-600 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all shadow-lg"
              >
                Gerenciar Plano
              </button>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] premium-shadow overflow-hidden flex flex-col border border-gray-50">
            <div className="p-8 border-b flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900">Pedidos Recentes</h3>
              <button onClick={() => navigate('/admin/pedidos')} className="text-purple-600 font-bold text-sm hover:underline">Ver todos</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-4 rounded-2xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/30 transition-all flex items-center justify-between group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-gray-900 group-hover:text-purple-600 transition-colors">{order.id}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                        order.status === 'preparing' ? "bg-orange-100 text-orange-600" :
                        order.status === 'pending' ? "bg-blue-100 text-blue-600" :
                        order.status === 'completed' ? "bg-green-100 text-green-600" :
                        "bg-red-100 text-red-600"
                      )}>
                        {order.status === 'pending' ? 'Pendente' : 
                         order.status === 'preparing' ? 'Preparando' :
                         order.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-purple-600">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <ShoppingBag className="w-12 h-12 text-gray-200 mb-2" />
                  <p className="text-gray-400 font-bold text-sm">Nenhum pedido ainda</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
