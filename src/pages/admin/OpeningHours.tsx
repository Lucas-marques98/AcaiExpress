import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const OpeningHours: React.FC = () => {
  const { currentStore, updateStore } = useStore();
  const [tempHours, setTempHours] = useState(currentStore?.openingHours || []);

  const handleSave = async () => {
    if (currentStore) {
      await updateStore(currentStore.id, { openingHours: tempHours });
      toast.success('Horários salvos!');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-gray-900">Horários de Funcionamento</h3>

      <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tempHours.map((hour, i) => (
            <div key={hour.day} className="p-6 rounded-2xl border border-gray-100 flex items-center justify-between hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary text-xs">
                  {hour.day.slice(0, 3).toUpperCase()}
                </div>
                <span className="font-bold text-gray-700">{hour.day}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="text" disabled={hour.closed} value={hour.open} onChange={(e) => {
                    const newHours = [...tempHours];
                    newHours[i].open = e.target.value;
                    setTempHours(newHours);
                  }} className="w-20 p-2 bg-gray-50 border border-gray-100 rounded-lg text-center font-bold text-sm outline-none focus:border-primary disabled:opacity-50" />
                  <span className="text-gray-400 font-bold">às</span>
                  <input type="text" disabled={hour.closed} value={hour.close} onChange={(e) => {
                    const newHours = [...tempHours];
                    newHours[i].close = e.target.value;
                    setTempHours(newHours);
                  }} className="w-20 p-2 bg-gray-50 border border-gray-100 rounded-lg text-center font-bold text-sm outline-none focus:border-primary disabled:opacity-50" />
                </div>
                <button 
                  onClick={() => {
                    const newHours = [...tempHours];
                    newHours[i].closed = !newHours[i].closed;
                    setTempHours(newHours);
                  }}
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-all",
                    hour.closed ? "bg-gray-200" : "bg-green-500"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                    hour.closed ? "left-1" : "right-1"
                  )} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleSave} className="w-full mt-8 rounded-2xl py-4">Salvar Horários</Button>
      </div>
    </div>
  );
};
