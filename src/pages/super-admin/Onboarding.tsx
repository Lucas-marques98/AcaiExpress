import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreVertical, 
  Calendar, 
  User as UserIcon,
  ChevronRight,
  CheckSquare,
  Square
} from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../../contexts/StoreContext';
import { cn } from '../../lib/utils';
import { OnboardingStatus } from '../../types';

export const SuperAdminOnboarding: React.FC = () => {
  const { onboardingChecklists, stores, toggleOnboardingItem } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | 'all'>('all');

  const getStoreName = (storeId: string) => stores.find(s => s.id === storeId)?.name || 'Loja não encontrada';

  const filteredOnboarding = onboardingChecklists.filter(ob => {
    const storeName = getStoreName(ob.storeId).toLowerCase();
    const matchesSearch = storeName.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ob.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OnboardingStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3 h-3" /> Concluído</span>;
      case 'in_progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><Clock className="w-3 h-3" /> Em Implantação</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><AlertCircle className="w-3 h-3" /> Pendente</span>;
      default:
        return null;
    }
  };

  const calculateProgress = (items: any[]) => {
    const completed = items.filter(i => i.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Gestão de Implantações</h1>
            <p className="text-gray-500 font-medium">Acompanhe o setup inicial de cada novo cliente.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border premium-shadow">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total em Setup</p>
          <p className="text-3xl font-black text-gray-900">{onboardingChecklists.filter(o => o.status !== 'completed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border premium-shadow">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Concluídos este mês</p>
          <p className="text-3xl font-black text-green-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border premium-shadow">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tempo Médio de Setup</p>
          <p className="text-3xl font-black text-blue-600">3.5 dias</p>
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
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Implantação</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
        </div>

        <div className="divide-y">
          {filteredOnboarding.map((ob) => (
            <div key={ob.id} className="p-6 hover:bg-gray-50/50 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-[250px]">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">{getStoreName(ob.storeId)}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                        <Calendar className="w-3 h-3" />
                        Início: {new Date(ob.startDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full" />
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                        <UserIcon className="w-3 h-3" />
                        Resp: Admin SaaS
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Progresso</span>
                    <span className="text-xs font-black text-primary">{calculateProgress(ob.items)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateProgress(ob.items)}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {getStatusBadge(ob.status)}
                  <button className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 shadow-sm">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {ob.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleOnboardingItem(ob.storeId, item.id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all",
                      item.completed 
                        ? "bg-green-50 border-green-100 text-green-600" 
                        : "bg-white border-gray-100 text-gray-400 hover:border-primary/30"
                    )}
                  >
                    {item.completed ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                    <span className="line-clamp-1">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
