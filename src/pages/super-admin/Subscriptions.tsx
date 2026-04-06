import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical,
  ArrowUpRight,
  Store as StoreIcon,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency, cn } from '../../lib/utils';
import { BillingStatus, OnboardingStatus } from '../../types';

export const SuperAdminSubscriptions: React.FC = () => {
  const { subscriptions, stores, plans } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillingStatus | 'all'>('all');

  const getStoreName = (storeId: string) => stores.find(s => s.id === storeId)?.name || 'Loja não encontrada';
  const getPlanName = (planId: string) => plans.find(p => p.id === planId)?.name || 'Plano não encontrado';

  const filteredSubscriptions = subscriptions.filter(sub => {
    const storeName = getStoreName(sub.storeId).toLowerCase();
    const matchesSearch = storeName.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BillingStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3 h-3" /> Ativa</span>;
      case 'trial':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><Clock className="w-3 h-3" /> Teste</span>;
      case 'overdue':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><AlertCircle className="w-3 h-3" /> Vencida</span>;
      case 'suspended':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><AlertCircle className="w-3 h-3" /> Suspensa</span>;
      case 'canceled':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><AlertCircle className="w-3 h-3" /> Cancelada</span>;
      default:
        return null;
    }
  };

  const getSetupStatusBadge = (status: OnboardingStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider">Concluído</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">Em Implantação</span>;
      case 'pending':
        return <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-wider">Pendente</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Gestão de Assinaturas</h1>
            <p className="text-gray-500 font-medium">Acompanhe o status de pagamento e planos das lojas.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border premium-shadow">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Assinaturas Ativas</p>
          <p className="text-3xl font-black text-gray-900">{subscriptions.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border premium-shadow">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Vencendo / Vencidas</p>
          <p className="text-3xl font-black text-amber-600">{subscriptions.filter(s => s.status === 'overdue').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border premium-shadow">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Em Período de Teste</p>
          <p className="text-3xl font-black text-blue-600">{subscriptions.filter(s => s.status === 'trial').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border premium-shadow">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Suspensas</p>
          <p className="text-3xl font-black text-red-600">{subscriptions.filter(s => s.status === 'suspended').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border premium-shadow overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por loja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-primary rounded-2xl outline-none transition-all font-bold"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-gray-50 border-transparent focus:bg-white focus:border-primary rounded-xl px-4 py-2 outline-none transition-all font-bold text-sm"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativas</option>
              <option value="trial">Em Teste</option>
              <option value="overdue">Vencidas</option>
              <option value="suspended">Suspensas</option>
              <option value="canceled">Canceladas</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Loja / Plano</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Valores</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Status Assinatura</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Setup</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Próxima Cobrança</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <StoreIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{getStoreName(sub.storeId)}</p>
                        <p className="text-xs font-bold text-primary">{getPlanName(sub.planId)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-black text-gray-900">{formatCurrency(sub.monthlyFee)}/mês</p>
                      <p className="text-[10px] font-bold text-gray-400">Setup: {formatCurrency(sub.setupFee)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(sub.status)}
                  </td>
                  <td className="px-6 py-4">
                    {getSetupStatusBadge(sub.setupStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(sub.nextBillingDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 shadow-sm">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
