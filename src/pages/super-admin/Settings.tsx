import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Mail, 
  Bell, 
  Shield, 
  Database, 
  CreditCard,
  Save,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { migrateData } from '../../lib/migrate';

export const SuperAdminSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Configurações da plataforma salvas com sucesso!');
  };

  const handleMigrate = async () => {
    if (!window.confirm('Deseja realmente migrar os dados mock para o banco de dados real? Isso pode sobrescrever dados existentes.')) {
      return;
    }

    setIsMigrating(true);
    try {
      await migrateData();
      toast.success('Dados migrados com sucesso para o Firestore!');
    } catch (error) {
      toast.error('Erro ao migrar dados. Verifique o console.');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Configurações da Plataforma</h1>
        <p className="text-gray-500 font-medium">Gerencie as configurações globais do seu SaaS.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'general', icon: Globe, label: 'Geral', active: true },
            { id: 'email', icon: Mail, label: 'Email & SMTP', active: false },
            { id: 'notifications', icon: Bell, label: 'Notificações', active: false },
            { id: 'security', icon: Shield, label: 'Segurança', active: false },
            { id: 'payments', icon: CreditCard, label: 'Pagamentos (SaaS)', active: false },
            { id: 'database', icon: Database, label: 'Banco de Dados', active: false },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                item.active 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Globe className="w-6 h-6 text-purple-600" />
                Informações Gerais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Nome da Plataforma</label>
                  <input 
                    type="text" 
                    defaultValue="MenuX Flex"
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">URL Base</label>
                  <input 
                    type="text" 
                    defaultValue="https://menuxflex.com"
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium text-gray-400"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email de Suporte</label>
                  <input 
                    type="email" 
                    defaultValue="suporte@menuxflex.com"
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Idioma Padrão</label>
                  <select className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium">
                    <option>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-gray-50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Database className="w-6 h-6 text-purple-600" />
                Manutenção de Dados
              </h3>
              
              <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-amber-900 mb-1">Migração de Dados Mock</h4>
                    <p className="text-sm text-amber-700 font-medium leading-relaxed mb-4">
                      Utilize esta ferramenta para popular seu banco de dados Firestore com os dados de exemplo (mock). 
                      Isso facilitará a visualização inicial da plataforma com lojas, produtos e planos reais.
                    </p>
                    <button 
                      onClick={handleMigrate}
                      disabled={isMigrating}
                      className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50"
                    >
                      {isMigrating ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-5 h-5" />
                      )}
                      {isMigrating ? 'Migrando Dados...' : 'Migrar Dados Mock para Firestore'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
