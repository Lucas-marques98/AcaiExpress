import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  CreditCard,
  Zap,
  Shield,
  Star,
  ArrowRight,
  HelpCircle,
  Lock
} from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../../components/Button';

export const MyPlan: React.FC = () => {
  const { currentStore, plans, subscriptions } = useStore();

  if (!currentStore) return null;

  const plan = plans.find(p => p.id === currentStore.planId);
  const subscription = subscriptions.find(s => s.storeId === currentStore.id);

  const status = currentStore.billingStatus || 'active';
  const isTrialExpired = status === 'trial' && 
                        currentStore.trialEndsAt && 
                        new Date(currentStore.trialEndsAt) < new Date();
  
  const effectiveStatus = isTrialExpired ? 'trial_expired' : status;
  const isBlocked = ['suspended', 'canceled', 'trial_expired', 'overdue'].includes(effectiveStatus);

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'básico': return <Zap className="w-8 h-8 text-blue-500" />;
      case 'profissional': return <Shield className="w-8 h-8 text-purple-500" />;
      case 'premium': return <Star className="w-8 h-8 text-amber-500" />;
      default: return <CreditCard className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3 h-3" /> Assinatura Ativa</span>;
      case 'trial':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><Clock className="w-3 h-3" /> Período de Teste</span>;
      case 'trial_expired':
        return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><Clock className="w-3 h-3" /> Teste Expirado</span>;
      case 'overdue':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><AlertCircle className="w-3 h-3" /> Pagamento Pendente</span>;
      case 'suspended':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><AlertCircle className="w-3 h-3" /> Loja Suspensa</span>;
      case 'canceled':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-black flex items-center gap-1.5 w-fit"><AlertCircle className="w-3 h-3" /> Assinatura Cancelada</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {isBlocked && (
        <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-red-900 mb-1">Acesso Restrito</h3>
            <p className="text-red-700 font-medium text-sm leading-relaxed">
              Sua loja está com o acesso restrito devido ao status da sua assinatura ({effectiveStatus}). 
              Regularize sua situação abaixo para reativar seu cardápio e painel administrativo.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Meu Plano & Assinatura</h1>
            <p className="text-gray-500 font-medium">Gerencie seu plano SaaS e detalhes de cobrança.</p>
          </div>
        </div>
        {subscription?.status === 'active' && (
          <Button variant="outline" className="rounded-xl font-black text-sm">
            Alterar Plano
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan Card */}
          <div className="bg-white rounded-[2.5rem] border premium-shadow overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner">
                    {plan ? getPlanIcon(plan.name) : <CreditCard className="w-8 h-8 text-gray-400" />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Plano Atual</p>
                    <h2 className="text-3xl font-black text-gray-900">{plan?.name || 'Nenhum plano selecionado'}</h2>
                  </div>
                </div>
                {getStatusBadge(effectiveStatus)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mensalidade</p>
                  <p className="text-2xl font-black text-gray-900">{formatCurrency(plan?.monthlyPrice || 0)}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Próximo Vencimento</p>
                  <div className="flex items-center gap-2 text-gray-900 font-black text-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    {subscription ? new Date(subscription.nextBillingDate).toLocaleDateString('pt-BR') : '--/--/----'}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Forma de Pagamento</p>
                  <div className="flex items-center gap-2 text-gray-900 font-black text-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Cartão de Crédito
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  O que está incluído no seu plano:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan?.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-green-50/30 rounded-2xl border border-green-100/50">
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 border-t flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Precisa de ajuda com sua assinatura?</span>
              </div>
              <button className="text-sm font-black text-primary hover:underline flex items-center gap-1">
                Falar com Suporte <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Limits Card */}
          <div className="bg-white rounded-[2.5rem] border premium-shadow p-8 sm:p-10">
            <h3 className="text-xl font-black text-gray-900 mb-8">Limites de Uso</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-gray-600">Produtos</span>
                  <span className="text-sm font-black text-primary">12 / {plan?.productLimit}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(12 / (plan?.productLimit || 1)) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-gray-600">Banners</span>
                  <span className="text-sm font-black text-primary">2 / {plan?.bannerLimit}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(2 / (plan?.bannerLimit || 1)) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-gray-600">Administradores</span>
                  <span className="text-sm font-black text-primary">1 / {plan?.adminLimit}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(1 / (plan?.adminLimit || 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Billing History */}
          <div className="bg-white rounded-[2.5rem] border premium-shadow p-8">
            <h3 className="text-xl font-black text-gray-900 mb-6">Histórico de Faturas</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">Fatura #{202400 + i}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pago em 0{i}/03/2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">{formatCurrency(plan?.monthlyPrice || 0)}</p>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Pago</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-black text-sm transition-all">
              Ver Todas as Faturas
            </button>
          </div>

          {/* Onboarding Status */}
          {currentStore.onboardingStatus !== 'completed' && (
            <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20">
              <h3 className="text-xl font-black mb-4">Sua Implantação</h3>
              <p className="text-primary-foreground/80 font-medium text-sm mb-6">
                Estamos configurando sua loja para garantir a melhor experiência.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-widest">Progresso</span>
                  <span className="text-xs font-black">65%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '65%' }} />
                </div>
                <p className="text-[10px] font-bold text-white/60 italic">
                  Próximo passo: Configuração de Domínio
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
