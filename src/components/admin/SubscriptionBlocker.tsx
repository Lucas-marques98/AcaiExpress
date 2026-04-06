import React from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertTriangle, CreditCard, ShieldAlert, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BillingStatus } from '../../types';

interface SubscriptionBlockerProps {
  status: BillingStatus;
  storeName: string;
}

export const SubscriptionBlocker: React.FC<SubscriptionBlockerProps> = ({ status, storeName }) => {
  const config = {
    overdue: {
      icon: AlertTriangle,
      color: 'amber',
      title: 'Pagamento Pendente',
      message: `Identificamos uma fatura em aberto para a ${storeName}. Algumas funcionalidades do painel foram limitadas até a regularização.`,
      buttonText: 'Regularizar Agora',
      buttonLink: '/admin/meu-plano',
    },
    suspended: {
      icon: Lock,
      color: 'red',
      title: 'Loja Suspensa',
      message: `O acesso à ${storeName} foi suspenso pelo administrador do sistema. Entre em contato com o suporte para mais informações.`,
      buttonText: 'Falar com Suporte',
      buttonLink: '#',
    },
    canceled: {
      icon: XCircle,
      color: 'gray',
      title: 'Assinatura Cancelada',
      message: `A assinatura da ${storeName} foi encerrada. O acesso ao painel e ao cardápio digital está desativado.`,
      buttonText: 'Reativar Assinatura',
      buttonLink: '/admin/meu-plano',
    },
  };

  const current = config[status as keyof typeof config] || config.suspended;
  const Icon = current.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto mt-12"
    >
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-gray-100 overflow-hidden relative">
        {/* Background Accent */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-${current.color}-500`} />
        
        <div className={`w-24 h-24 bg-${current.color}-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8`}>
          <Icon className={`w-12 h-12 text-${current.color}-500`} />
        </div>

        <h3 className="text-4xl font-black text-gray-900 mb-4">{current.title}</h3>
        <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
          {current.message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to={current.buttonLink}
            className={`bg-${current.color === 'gray' ? 'gray-900' : current.color + '-600'} text-white px-10 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-${current.color}-200`}
          >
            {current.buttonText}
          </Link>
          <button className="bg-white text-gray-700 border-2 border-gray-100 px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all">
            Suporte Técnico
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50">
          <div className="flex items-center justify-center gap-2 text-gray-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>MenuX Flex Security Protocol</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
