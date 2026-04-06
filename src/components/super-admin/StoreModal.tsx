import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Store as StoreIcon, Globe, Palette, Phone, MapPin, CreditCard, Clock } from 'lucide-react';
import { Store, StoreSegment, Plan } from '../../types';
import { Button } from '../Button';
import { cn } from '../../lib/utils';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (store: Omit<Store, 'id' | 'createdAt'>) => void;
  store?: Store;
  plans: Plan[];
}

const segments: StoreSegment[] = [
  'açaiteria', 'restaurante', 'pizzaria', 'pastelaria', 
  'hamburgueria', 'lanchonete', 'doceria', 'marmitaria'
];

export const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose, onSave, store, plans }) => {
  const [formData, setFormData] = useState<Omit<Store, 'id' | 'createdAt'>>({
    name: '',
    slug: '',
    segment: 'açaiteria',
    logo: 'https://picsum.photos/seed/logo/200/200',
    banner: 'https://picsum.photos/seed/banner/1200/400',
    primaryColor: '#6b21a8',
    secondaryColor: '#9333ea',
    whatsapp: '',
    address: '',
    minOrderValue: 0,
    deliveryTime: '30-45 min',
    isOpen: true,
    status: 'active',
    openingHours: [
      { day: 'Segunda', open: '09:00', close: '22:00', closed: false },
      { day: 'Terça', open: '09:00', close: '22:00', closed: false },
      { day: 'Quarta', open: '09:00', close: '22:00', closed: false },
      { day: 'Quinta', open: '09:00', close: '22:00', closed: false },
      { day: 'Sexta', open: '09:00', close: '23:00', closed: false },
      { day: 'Sábado', open: '10:00', close: '23:00', closed: false },
      { day: 'Domingo', open: '10:00', close: '22:00', closed: false },
    ],
    planId: plans[0]?.id || '',
    onboardingStatus: 'pending',
    billingStatus: 'trial',
    monthlyFee: 0,
    setupFee: 0,
    startDate: new Date().toISOString(),
    deliveryFee: 0,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  });

  useEffect(() => {
    if (store) {
      const { id, createdAt, ...rest } = store;
      setFormData(rest);
    } else {
      setFormData({
        name: '',
        slug: '',
        segment: 'açaiteria',
        logo: 'https://picsum.photos/seed/logo/200/200',
        banner: 'https://picsum.photos/seed/banner/1200/400',
        primaryColor: '#6b21a8',
        secondaryColor: '#9333ea',
        whatsapp: '',
        address: '',
        minOrderValue: 0,
        deliveryFee: 0,
        deliveryTime: '30-45 min',
        isOpen: true,
        status: 'active',
        openingHours: [
          { day: 'Segunda', open: '09:00', close: '22:00', closed: false },
          { day: 'Terça', open: '09:00', close: '22:00', closed: false },
          { day: 'Quarta', open: '09:00', close: '22:00', closed: false },
          { day: 'Quinta', open: '09:00', close: '22:00', closed: false },
          { day: 'Sexta', open: '09:00', close: '23:00', closed: false },
          { day: 'Sábado', open: '10:00', close: '23:00', closed: false },
          { day: 'Domingo', open: '10:00', close: '22:00', closed: false },
        ],
        planId: plans[0]?.id || '',
        onboardingStatus: 'pending',
        billingStatus: 'trial',
        monthlyFee: 0,
        setupFee: 0,
        startDate: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  }, [store, plans, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate slug from name if slug is empty or matches previous auto-slug
      if (field === 'name') {
        const oldAutoSlug = prev.name.toLowerCase().replace(/\s+/g, '-');
        if (!prev.slug || prev.slug === oldAutoSlug) {
          newData.slug = value.toLowerCase().replace(/\s+/g, '-');
        }
      }
      
      return newData;
    });
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
            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-200">
                  <StoreIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {store ? 'Editar Loja' : 'Nova Loja'}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    {store ? 'Atualize as informações da loja.' : 'Cadastre uma nova loja na plataforma.'}
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
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nome da Loja</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Ex: Açaí Express"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Slug (URL amigável)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">/loja/</span>
                      <input
                        required
                        type="text"
                        value={formData.slug}
                        onChange={(e) => updateField('slug', e.target.value)}
                        placeholder="acai-express"
                        className="w-full pl-16 pr-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Segmento</label>
                    <select
                      value={formData.segment}
                      onChange={(e) => updateField('segment', e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium capitalize"
                    >
                      {segments.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Telefone (Opcional)</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="(11) 4444-4444"
                        className="w-full pl-14 pr-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        required
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => updateField('whatsapp', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full pl-14 pr-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual & Branding */}
              <div className="space-y-6 pt-8 border-t">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Identidade Visual
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Cor Primária</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => updateField('primaryColor', e.target.value)}
                        className="w-14 h-14 rounded-xl border-none cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => updateField('primaryColor', e.target.value)}
                        className="flex-1 px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Cor Secundária</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                        className="w-14 h-14 rounded-xl border-none cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                        className="flex-1 px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">URL do Logo</label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => updateField('logo', e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">URL do Banner</label>
                    <input
                      type="url"
                      value={formData.banner}
                      onChange={(e) => updateField('banner', e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery & Address */}
              <div className="space-y-6 pt-8 border-t">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Endereço & Entrega
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Endereço Completo</label>
                    <input
                      required
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Rua, Número, Bairro, Cidade - UF"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Pedido Mínimo (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.minOrderValue}
                        onChange={(e) => updateField('minOrderValue', parseFloat(e.target.value))}
                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Tempo de Entrega</label>
                      <div className="relative">
                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.deliveryTime}
                          onChange={(e) => updateField('deliveryTime', e.target.value)}
                          placeholder="Ex: 30-45 min"
                          className="w-full pl-14 pr-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Plan */}
              <div className="space-y-6 pt-8 border-t">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Plano de Assinatura
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Plano Ativo</label>
                    <select
                      value={formData.planId}
                      onChange={(e) => updateField('planId', e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                    >
                      {plans.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - R$ {p.monthlyPrice.toFixed(2)}/mês</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Data de Expiração</label>
                    <input
                      type="date"
                      value={formData.expiresAt ? formData.expiresAt.split('T')[0] : ''}
                      onChange={(e) => updateField('expiresAt', new Date(e.target.value).toISOString())}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                    />
                  </div>
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
                {store ? 'Salvar Alterações' : 'Criar Loja'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
