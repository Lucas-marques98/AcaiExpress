import React, { useState } from 'react';
import { Settings as SettingsIcon, MapPin, Phone, Store } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/Button';
import { toast } from 'sonner';

export const Settings: React.FC = () => {
  const { currentStore, updateStore } = useStore();
  const [tempSettings, setTempSettings] = useState(currentStore);

  const handleSave = async () => {
    if (currentStore && tempSettings) {
      await updateStore(currentStore.id, tempSettings);
      toast.success('Configurações salvas!');
    }
  };

  if (!tempSettings) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-gray-900">Configurações da Loja</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-gray-50 space-y-6">
          <h4 className="text-lg font-black flex items-center gap-2 text-gray-900"><Store className="w-5 h-5 text-primary" /> Informações Gerais</h4>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome da Loja</label>
              <input type="text" value={tempSettings.name} onChange={(e) => setTempSettings({...tempSettings, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp de Pedidos</label>
              <input type="text" value={tempSettings.whatsapp} onChange={(e) => setTempSettings({...tempSettings, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tempo Médio de Entrega (min)</label>
              <input type="text" value={tempSettings.deliveryTime} onChange={(e) => setTempSettings({...tempSettings, deliveryTime: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-gray-50 space-y-6">
          <h4 className="text-lg font-black flex items-center gap-2 text-gray-900"><MapPin className="w-5 h-5 text-primary" /> Localização e Taxas</h4>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Endereço Completo</label>
              <input type="text" value={tempSettings.address} onChange={(e) => setTempSettings({...tempSettings, address: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Taxa de Entrega Padrão</label>
              <input type="number" step="0.01" value={tempSettings.deliveryFee} onChange={(e) => setTempSettings({...tempSettings, deliveryFee: parseFloat(e.target.value)})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedido Mínimo</label>
              <input type="number" step="0.01" value={tempSettings.minOrderValue} onChange={(e) => setTempSettings({...tempSettings, minOrderValue: parseFloat(e.target.value)})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
            </div>
          </div>
        </div>
      </div>
      <Button onClick={handleSave} className="w-full rounded-2xl py-4 text-lg">Salvar Todas as Alterações</Button>
    </div>
  );
};
