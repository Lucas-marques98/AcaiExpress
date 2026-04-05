import React from 'react';
import { Plus, Ticket } from 'lucide-react';
import { Button } from '../../components/Button';

export const Coupons: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900">Cupons de Desconto</h3>
        <Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" /> Novo Cupom</Button>
      </div>

      <div className="bg-white p-12 rounded-[2.5rem] premium-shadow border border-gray-50 text-center">
        <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <Ticket className="w-10 h-10 text-accent" />
        </div>
        <h4 className="text-xl font-black text-gray-900 mb-2">Gerencie seus Cupons</h4>
        <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
          Crie códigos de desconto exclusivos para seus clientes e aumente suas vendas.
        </p>
        <Button variant="outline" className="rounded-2xl px-8 py-4">Começar Agora</Button>
      </div>
    </div>
  );
};
