import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle,
  CreditCard,
  Check,
  MoreVertical,
  Zap,
  Shield,
  Star
} from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Plan } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';
import { PlanModal } from '../../components/super-admin/PlanModal';

export const SuperAdminPlans: React.FC = () => {
  const { plans, addPlan, updatePlan, deletePlan } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleAddPlan = () => {
    setSelectedPlan(undefined);
    setIsModalOpen(true);
  };

  const handleSavePlan = (planData: Omit<Plan, 'id'>) => {
    if (selectedPlan) {
      updatePlan(selectedPlan.id, planData);
      toast.success(`Plano ${planData.name} atualizado com sucesso!`);
    } else {
      addPlan(planData);
      toast.success(`Plano ${planData.name} criado com sucesso!`);
    }
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      deletePlan(id);
      toast.success('Plano excluído com sucesso!');
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'básico': return <Zap className="w-6 h-6 text-blue-500" />;
      case 'profissional': return <Shield className="w-6 h-6 text-purple-500" />;
      case 'premium': return <Star className="w-6 h-6 text-amber-500" />;
      default: return <CreditCard className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planos e Assinaturas</h1>
          <p className="text-gray-500">Gerencie os planos disponíveis para os lojistas.</p>
        </div>
        <button 
          onClick={handleAddPlan}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-purple-200"
        >
          <Plus className="w-5 h-5" />
          Novo Plano
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome do plano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-2xl">
                  {getPlanIcon(plan.name)}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditPlan(plan)}
                    className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-purple-600">{formatCurrency(plan.monthlyPrice)}</span>
                    <span className="text-sm text-gray-500 font-medium">/mês</span>
                  </div>
                  <div className="text-xs font-bold text-gray-400">
                    Taxa de Setup: {formatCurrency(plan.setupPrice)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 space-y-6">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 p-2 rounded-xl text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Produtos</p>
                  <p className="text-sm font-black text-gray-900">{plan.productLimit}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Banners</p>
                  <p className="text-sm font-black text-gray-900">{plan.bannerLimit}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Admins</p>
                  <p className="text-sm font-black text-gray-900">{plan.adminLimit}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                  Funcionalidades Incluídas
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                      <div className="mt-0.5 p-0.5 bg-green-100 text-green-600 rounded-full">
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${plan.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  {plan.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <button className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-all">
                Ver Lojistas
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
        plan={selectedPlan}
      />
    </div>
  );
};
