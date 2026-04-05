import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { storeConfig } = useStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error('Por favor, insira sua senha');
      return;
    }

    setIsLoading(true);
    
    // Artificial delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));

    if (login(password)) {
      toast.success('Acesso autorizado! Bem-vindo.');
      navigate('/admin/dashboard');
    } else {
      setIsLoading(false);
      toast.error('Senha incorreta. Tente novamente.');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#fafafa] dark:bg-[#09090b] transition-colors duration-500">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 dark:bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-white dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-primary/20 border border-gray-100 dark:border-white/10 premium-shadow"
          >
            <img src={storeConfig.logo} alt="Logo" className="w-12 h-12 object-contain dark:invert" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Açaí <span className="text-primary">Express</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Área segura do lojista</span>
            </div>
          </motion.div>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white dark:border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                  Senha de Acesso
                </label>
                <span className="text-[10px] font-black text-primary dark:text-primary-light uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Admin Pro
                </span>
              </div>
              
              <div className="relative group/input">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 text-gray-400 group-focus-within/input:text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                
                <input
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  disabled={isLoading}
                  className={cn(
                    "w-full pl-14 pr-14 py-5 bg-gray-50/50 dark:bg-black/20 rounded-[1.5rem] border-2 border-transparent outline-none transition-all font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700",
                    "focus:border-primary/30 focus:bg-white dark:focus:bg-black/40 focus:ring-4 focus:ring-primary/5",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors rounded-xl hover:bg-primary/5"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-6 text-lg rounded-[1.5rem] font-black bg-gradient-to-r from-primary to-primary-light hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            <div className="flex flex-col items-center gap-4">
              <div className="h-px w-12 bg-gray-100 dark:bg-white/10" />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest text-center">
                Área restrita ao administrador
              </p>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-gray-400 dark:text-gray-600 text-xs font-bold"
        >
          Dica: Use <span className="text-primary/60 dark:text-primary/40">admin123</span> para testar o sistema.
        </motion.p>
      </motion.div>
    </div>
  );
};
