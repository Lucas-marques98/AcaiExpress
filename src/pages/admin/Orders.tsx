import React from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../../components/Button';
import { Order } from '../../types';

export const Orders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900">Gestão de Pedidos</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar pedido..." className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl outline-none focus:border-primary transition-all font-bold text-sm" />
          </div>
          <Button variant="outline" size="sm" className="rounded-xl"><Filter className="w-4 h-4 mr-2" /> Filtros</Button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] premium-shadow overflow-hidden border border-gray-50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedido</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-black text-gray-900">{order.id}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{order.customerName}</p>
                  <p className="text-xs text-gray-500">{order.customerPhone}</p>
                </td>
                <td className="px-6 py-4 font-black text-primary">{formatCurrency(order.total)}</td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer",
                      order.status === 'preparing' ? "bg-orange-100 text-orange-600" :
                      order.status === 'pending' ? "bg-blue-100 text-blue-600" :
                      order.status === 'completed' ? "bg-green-100 text-green-600" :
                      "bg-red-100 text-red-600"
                    )}
                  >
                    <option value="pending">Pendente</option>
                    <option value="preparing">Preparando</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold">Nenhum pedido registrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
