import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ShoppingBag, MessageSquare } from 'lucide-react';
import { Button } from '../components/Button';

export const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] flex flex-col items-center justify-center p-6 text-center transition-colors duration-500">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="w-24 h-24 md:w-32 md:h-32 bg-green-100 dark:bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 premium-shadow"
      >
        <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-500" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-sm w-full"
      >
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">Pedido Enviado!</h1>
        <p className="text-gray-700 dark:text-gray-200 mb-10 font-bold text-sm md:text-base leading-relaxed">
          Seu pedido foi enviado com sucesso para o nosso WhatsApp. Em breve iniciaremos o preparo!
        </p>

        <div className="space-y-4 w-full">
          <Button 
            onClick={() => navigate('/')} 
            className="w-full py-4 md:py-5 rounded-2xl flex items-center justify-center gap-2 font-black text-base md:text-lg premium-shadow"
          >
            <ShoppingBag className="w-5 h-5" />
            Voltar ao Início
          </Button>
          
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
            <MessageSquare className="w-3 h-3" /> Fique atento ao seu WhatsApp
          </p>
        </div>
      </motion.div>
    </div>
  );
};
