import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/Button';
import { toast } from 'sonner';

export const Banners: React.FC = () => {
  const { currentStore, updateStore } = useStore();
  const [tempBanner, setTempBanner] = useState(currentStore?.banner || '');

  const handleSave = async () => {
    if (currentStore) {
      await updateStore(currentStore.id, { banner: tempBanner });
      toast.success('Banner atualizado!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900">Banner da Loja</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-gray-50 space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL da Imagem do Banner</label>
            <input 
              type="text" 
              value={tempBanner} 
              onChange={(e) => setTempBanner(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" 
            />
          </div>
          <Button onClick={handleSave} className="w-full rounded-2xl py-4">Salvar Alterações</Button>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Pré-visualização</label>
          <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">
            <img src={tempBanner} alt="Banner Preview" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};
