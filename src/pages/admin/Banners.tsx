import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/Button';
import { toast } from 'sonner';

export const Banners: React.FC = () => {
  const { storeConfig, updateBanner } = useStore();
  const [tempBanner, setTempBanner] = useState(storeConfig.banner);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900">Banners Promocionais</h3>
        <Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" /> Novo Banner</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-gray-50 space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título do Banner</label>
            <input type="text" value={tempBanner.title} onChange={(e) => setTempBanner({...tempBanner, title: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtítulo</label>
            <input type="text" value={tempBanner.subtitle} onChange={(e) => setTempBanner({...tempBanner, subtitle: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL da Imagem</label>
            <input type="text" value={tempBanner.image} onChange={(e) => setTempBanner({...tempBanner, image: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
          </div>
          <Button onClick={() => { updateBanner(tempBanner); toast.success('Banner atualizado!'); }} className="w-full rounded-2xl py-4">Salvar Alterações</Button>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Pré-visualização</label>
          <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img src={tempBanner.image} alt="Banner Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-12">
              <span className="text-accent font-black uppercase tracking-[0.3em] text-sm mb-2">{tempBanner.subtitle}</span>
              <h3 className="text-4xl font-black text-white leading-tight max-w-md">{tempBanner.title}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
