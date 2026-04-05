import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency, cn } from '../../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { orders } = useStore();
  const navigate = useNavigate();

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] premium-shadow p-8 border border-gray-50">
          <h3 className="text-xl font-black mb-6">Desempenho Semanal</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                />
                <Line type="monotone" dataKey="vendas" stroke="#6b21a8" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] premium-shadow overflow-hidden flex flex-col border border-gray-50">
          <div className="p-8 border-b flex items-center justify-between">
            <h3 className="text-xl font-black">Pedidos Recentes</h3>
            <button onClick={() => navigate('/admin/pedidos')} className="text-primary font-bold text-sm">Ver todos</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-gray-900">{order.id}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                      order.status === 'preparing' ? "bg-orange-100 text-orange-600" :
                      order.status === 'pending' ? "bg-blue-100 text-blue-600" :
                      order.status === 'completed' ? "bg-green-100 text-green-600" :
                      "bg-red-100 text-red-600"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary">{formatCurrency(order.total)}</p>
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
  );
};
