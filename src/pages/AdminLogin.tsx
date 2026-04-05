import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast.success('Bem-vindo ao Painel!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Senha incorreta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Painel do Lojista</h1>
          <p className="text-gray-400 font-medium">Acesse sua conta para gerenciar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-2">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-primary outline-none transition-all font-bold"
              />
            </div>
          </div>
          <Button type="submit" className="w-full py-4 text-lg rounded-2xl">
            Entrar no Painel
          </Button>
          <p className="text-center text-xs text-gray-400">Dica: Use admin123</p>
        </form>
      </motion.div>
    </div>
  );
};
