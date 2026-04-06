import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, CreditCard, Check, Plus, Trash2, Zap, Shield, Star } from 'lucide-react';
import { Plan } from '../../types';
import { Button } from '../Button';
import { cn } from '../../lib/utils';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<Plan, 'id'>) => void;
  plan?: Plan;
}

export const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, onSave, plan }) => {
  const [formData, setFormData] = useState<Omit<Plan, 'id'>>({
    name: '',
    description: '',
    monthlyPrice: 0,
    setupPrice: 0,
    productLimit: 0,
    bannerLimit: 0,
    adminLimit: 0,
    allowedSegments: ['food'],
    features: [''],
    active: true
  });

  useEffect(() => {
    if (plan) {
      const { id, ...rest } = plan;
      setFormData(rest);
    } else {
      setFormData({
        name: '',
        description: '',
        monthlyPrice: 0,
        setupPrice: 0,
        productLimit: 50,
        bannerLimit: 3,
        adminLimit: 1,
        allowedSegments: ['food'],
        features: ['Suporte 24/7', 'Painel Administrativo', 'Relatórios Básicos'],
        active: true
      });
    }
  }, [plan, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-200">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {plan ? 'Editar Plano' : 'Novo Plano'}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    {plan ? 'Atualize as condições do plano.' : 'Crie um novo plano de assinatura.'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Nome do Plano</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Ex: Profissional"
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Breve descrição do plano..."
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Mensalidade (R$)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.monthlyPrice}
                    onChange={(e) => updateField('monthlyPrice', parseFloat(e.target.value))}
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Taxa de Setup (R$)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.setupPrice}
                    onChange={(e) => updateField('setupPrice', parseFloat(e.target.value))}
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Limite de Produtos</label>
                  <input
                    required
                    type="number"
                    value={formData.productLimit}
                    onChange={(e) => updateField('productLimit', parseInt(e.target.value))}
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Limite de Banners</label>
                  <input
                    required
                    type="number"
                    value={formData.bannerLimit}
                    onChange={(e) => updateField('bannerLimit', parseInt(e.target.value))}
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Limite de Admins</label>
                  <input
                    required
                    type="number"
                    value={formData.adminLimit}
                    onChange={(e) => updateField('adminLimit', parseInt(e.target.value))}
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Status</label>
                  <div className="flex items-center gap-4 h-[54px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.active}
                        onChange={() => updateField('active', true)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-bold text-gray-700">Ativo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.active}
                        onChange={() => updateField('active', false)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-bold text-gray-700">Inativo</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 ml-1">Funcionalidades</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-xs font-black text-purple-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-0.5 bg-green-100 text-green-600 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Ex: Suporte 24/7"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all font-medium text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 sm:p-8 border-t bg-gray-50/50 flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-8"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="px-8 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
              >
                <Save className="w-5 h-5 mr-2" />
                {plan ? 'Salvar Alterações' : 'Criar Plano'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
