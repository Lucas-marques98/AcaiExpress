import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Lock, 
  Zap, 
  CreditCard, 
  Clock, 
  HelpCircle, 
  ExternalLink,
  Ban,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { BillingStatus } from '../types';

interface SubscriptionBlockingScreenProps {
  status: BillingStatus;
  storeName?: string;
  isAdmin?: boolean;
}

export const SubscriptionBlockingScreen: React.FC<SubscriptionBlockingScreenProps> = ({ 
  status, 
  storeName,
  isAdmin = false 
}) => {
  const navigate = useNavigate();

  const config = {
    overdue: {
      icon: CreditCard,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      title: 'Assinatura Vencida',
      message: `A mensalidade da loja ${storeName || ''} está pendente. Regularize agora para manter seu cardápio online e continuar recebendo pedidos.`,
      action: 'Regularizar Agora',
      secondaryAction: 'Falar com Suporte',
      statusText: 'Pagamento Pendente',
      path: '/admin/meu-plano'
    },
    suspended: {
      icon: Ban,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      title: 'Loja Suspensa',
      message: 'Esta loja foi suspensa temporariamente por nossa equipe de segurança. Se você é o proprietário, entre em contato com nosso suporte para reativar sua conta.',
      action: 'Falar com Suporte',
      secondaryAction: undefined,
      statusText: 'Conta Suspensa',
      path: 'https://wa.me/5500000000000' // Placeholder for WhatsApp
    },
    trial_expired: {
      icon: Clock,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      title: 'Período de Teste Encerrado',
      message: 'Seu período de degustação gratuita chegou ao fim. Esperamos que tenha gostado da experiência! Ative sua assinatura para continuar crescendo.',
      action: 'Escolher Plano',
      secondaryAction: 'Ver Demonstração',
      statusText: 'Trial Expirado',
      path: '/admin/meu-plano'
    },
    canceled: {
      icon: Ban,
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-50',
      title: 'Assinatura Cancelada',
      message: 'O acesso a esta loja foi encerrado devido ao cancelamento da assinatura. Para reativar e recuperar seus dados, escolha um novo plano.',
      action: 'Reativar Conta',
      secondaryAction: undefined,
      statusText: 'Conta Cancelada',
      path: '/admin/meu-plano'
    },
    trial: { icon: Clock, iconColor: '', bgColor: '', title: '', message: '', action: '', secondaryAction: undefined, statusText: '', path: '' },
    active: { icon: Zap, iconColor: '', bgColor: '', title: '', message: '', action: '', secondaryAction: undefined, statusText: '', path: '' }
  };

  const current = config[status] || config.suspended;
  const Icon = current.icon;

  const handleAction = () => {
    if (current.path.startsWith('http')) {
      window.open(current.path, '_blank');
    } else {
      navigate(current.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0b] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="bg-white dark:bg-[#1a1a1c] rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="p-10 lg:p-14 text-center">
            <div className={`w-24 h-24 ${current.bgColor} dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 relative`}>
              <Icon className={`w-12 h-12 ${current.iconColor}`} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-[#1a1a1c] rounded-full flex items-center justify-center shadow-sm"
              >
                <Lock className="w-3 h-3 text-gray-400" />
              </motion.div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-full mb-6">
              <div className={`w-2 h-2 rounded-full ${current.iconColor.replace('text', 'bg')}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{current.statusText}</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              {current.title}
            </h1>
            
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-12 text-lg">
              {current.message}
            </p>

            {isAdmin ? (
              <div className="space-y-4">
                <button 
                  onClick={handleAction}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
                >
                  {current.action}
                  <ArrowRight className="w-5 h-5" />
                </button>
                {current.secondaryAction && (
                  <button className="w-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white font-black py-6 rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-3 text-lg">
                    {current.secondaryAction}
                    <HelpCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                <p className="text-sm text-gray-400 font-medium mb-8">
                  Se você é o proprietário desta loja, acesse seu painel administrativo para regularizar sua situação.
                </p>
                <button 
                  onClick={() => navigate('/admin/login')}
                  className="inline-flex items-center gap-3 text-purple-600 font-black hover:gap-5 transition-all"
                >
                  Acessar Painel Admin
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-white/5 p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-[#1a1a1c] rounded-xl flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Plataforma</p>
                <p className="text-sm font-black text-gray-900 dark:text-white leading-none">MenuX Flex</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Suporte</p>
              <p className="text-sm font-black text-purple-600 leading-none">@menuxflex</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

