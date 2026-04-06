import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Store as StoreIcon,
  Calendar,
  CreditCard,
  MapPin
} from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Store, StoreStatus } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { toast } from 'sonner';
import { StoreModal } from '../../components/super-admin/StoreModal';

export const SuperAdminStores: React.FC = () => {
  const { stores, plans, updateStore, addStore } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StoreStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | undefined>(undefined);

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         store.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (store: Store) => {
    const newStatus: StoreStatus = store.status === 'active' ? 'suspended' : 'active';
    updateStore(store.id, { status: newStatus });
    toast.success(`Loja ${store.name} ${newStatus === 'active' ? 'ativada' : 'suspensa'} com sucesso!`);
  };

  const handleEditStore = (store: Store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleAddStore = () => {
    setSelectedStore(undefined);
    setIsModalOpen(true);
  };

  const handleSaveStore = (storeData: Omit<Store, 'id' | 'createdAt'>) => {
    if (selectedStore) {
      updateStore(selectedStore.id, storeData);
      toast.success(`Loja ${storeData.name} atualizada com sucesso!`);
    } else {
      addStore(storeData);
      toast.success(`Loja ${storeData.name} criada com sucesso!`);
    }
  };

  const getPlanName = (planId?: string) => {
    return plans.find(p => p.id === planId)?.name || 'Nenhum';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Lojas</h1>
          <p className="text-gray-500">Visualize e gerencie todas as lojas da plataforma.</p>
        </div>
        <button 
          onClick={handleAddStore}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-purple-200"
        >
          <Plus className="w-5 h-5" />
          Nova Loja
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 transition-all text-gray-600"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativas</option>
            <option value="suspended">Suspensas</option>
            <option value="onboarding">Em Implantação</option>
            <option value="canceled">Canceladas</option>
          </select>
          <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
          >
            <div className="h-24 relative">
              <img 
                src={store.banner} 
                alt={store.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
              <div className="absolute top-4 right-4">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  store.status === 'active' ? "bg-green-100 text-green-700 border-green-200" :
                  store.status === 'suspended' ? "bg-red-100 text-red-700 border-red-200" :
                  store.status === 'onboarding' ? "bg-blue-100 text-blue-700 border-blue-200" :
                  "bg-gray-100 text-gray-700 border-gray-200"
                )}>
                  {store.status === 'active' ? 'Ativa' : 
                   store.status === 'suspended' ? 'Suspensa' :
                   store.status === 'onboarding' ? 'Implantação' : 'Cancelada'}
                </span>
              </div>
            </div>

            <div className="p-5 pt-0 -mt-8 relative">
              <div className="flex items-end justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl border-4 border-white bg-white shadow-sm overflow-hidden">
                  <img 
                    src={store.logo} 
                    alt={store.name}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleToggleStatus(store)}
                    className={`p-2 rounded-xl transition-all ${
                      store.status === 'active'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                    title={store.status === 'active' ? 'Desativar Loja' : 'Ativar Loja'}
                  >
                    {store.status === 'active' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => handleEditStore(store)}
                    className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={`/loja/${store.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{store.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">/{store.slug}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <StoreIcon className="w-4 h-4 text-gray-400" />
                    <span className="capitalize">{store.segment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span>{getPlanName(store.planId)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Desde {new Date(store.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">Taboão da Serra, SP</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                    Vencimento do Plano
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {store.expiresAt ? new Date(store.expiresAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <StoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStore}
        store={selectedStore}
        plans={plans}
      />
    </div>
  );
};
