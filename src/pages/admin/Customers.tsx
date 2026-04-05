import React from 'react';
import { Users, Search, Filter, Phone } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/Button';

export const Customers: React.FC = () => {
  const { orders } = useStore();

  // Extract unique customers from orders
  const customers = React.useMemo(() => {
    const customerMap = new Map();
    orders.forEach(order => {
      if (!customerMap.has(order.customerPhone)) {
        customerMap.set(order.customerPhone, {
          name: order.customerName,
          phone: order.customerPhone,
          totalSpent: 0,
          orderCount: 0,
          lastOrder: order.createdAt
        });
      }
      const customer = customerMap.get(order.customerPhone);
      customer.totalSpent += order.total;
      customer.orderCount += 1;
      if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
        customer.lastOrder = order.createdAt;
      }
    });
    return Array.from(customerMap.values());
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900">Base de Clientes</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar cliente..." className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl outline-none focus:border-primary transition-all font-bold text-sm" />
          </div>
          <Button variant="outline" size="sm" className="rounded-xl"><Filter className="w-4 h-4 mr-2" /> Filtros</Button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] premium-shadow overflow-hidden border border-gray-50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedidos</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Gasto</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Último Pedido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.map((customer) => (
              <tr key={customer.phone} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-black text-gray-900">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a href={`https://wa.me/${customer.phone}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-green-600 font-bold hover:underline">
                    <Phone className="w-4 h-4" />
                    {customer.phone}
                  </a>
                </td>
                <td className="px-6 py-4 font-bold text-gray-600">{customer.orderCount}</td>
                <td className="px-6 py-4 font-black text-primary">{formatCurrency(customer.totalSpent)}</td>
                <td className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  {new Date(customer.lastOrder).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold">Nenhum cliente registrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
