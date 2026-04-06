import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Zap, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Store, BillingStatus } from '../types';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'SUPER_ADMIN') {
        navigate('/menu-flex-admin/dashboard', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Por favor, insira um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Set persistence based on "Remember Me"
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch user data to check role and store
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado no sistema.');
      }

      const userData = userDoc.data();
      
      // If store admin, check store status
      if (userData.role === 'STORE_ADMIN' && userData.storeId) {
        const storeDoc = await getDoc(doc(db, 'stores', userData.storeId));
        if (storeDoc.exists()) {
          const storeData = storeDoc.data() as Store;
          
          // Check trial expiration
          const status = storeData.billingStatus || 'active';
          const isTrialExpired = status === 'trial' && 
                                storeData.trialEndsAt && 
                                new Date(storeData.trialEndsAt) < new Date();
          
          const effectiveStatus = isTrialExpired ? 'trial_expired' : status;

          // Blocked statuses
          const blockedStatuses: BillingStatus[] = ['suspended', 'canceled', 'trial_expired', 'overdue'];
          
          if (blockedStatuses.includes(effectiveStatus as BillingStatus)) {
            // We allow login but ProtectedRoute will handle the blocking screen
            // However, it's good to warn here too
            if (effectiveStatus === 'overdue') {
              toast.warning('Sua assinatura está atrasada. Regularize para evitar bloqueio total.');
            }
          }
        }
      }

      await refreshUser();
      toast.success('Login realizado com sucesso!');
      
      // Redirect based on role
      if (userData.role === 'SUPER_ADMIN') {
        navigate('/menu-flex-admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Erro ao realizar login. Verifique suas credenciais.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Email ou senha incorretos.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email inválido.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Muitas tentativas malsucedidas. Tente novamente mais tarde.';
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !validateEmail(email)) {
      toast.error('Por favor, insira seu e-mail para recuperar a senha.');
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error('Erro ao enviar e-mail de recuperação. Verifique se o e-mail está correto.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-100/50 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 dark:shadow-none group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            MenuX <span className="text-purple-600">Flex</span>
          </span>
        </Link>
        
        <div className="bg-white dark:bg-[#1a1a1c] py-10 px-6 shadow-2xl shadow-gray-200/50 dark:shadow-none sm:rounded-[2.5rem] sm:px-12 border border-gray-100 dark:border-white/5">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Bem-vindo de volta</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Acesse seu painel administrativo</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest ml-1">
                Email Profissional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest ml-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-white/10 rounded bg-white dark:bg-white/5"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-bold text-gray-600 dark:text-gray-400">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="font-bold text-purple-600 hover:text-purple-500 transition-colors disabled:opacity-50"
                >
                  {resetLoading ? 'Enviando...' : 'Esqueceu a senha?'}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-purple-100 dark:shadow-none text-lg font-black text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Entrar no Painel
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black">
                <span className="px-4 bg-white dark:bg-[#1a1a1c] text-gray-400 uppercase tracking-widest">
                  Ainda não tem conta?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/cadastro"
                className="w-full flex justify-center py-4 px-4 border-2 border-gray-100 dark:border-white/10 rounded-2xl shadow-sm text-lg font-black text-gray-700 dark:text-gray-200 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center flex flex-col gap-4">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Voltar para a Home
          </Link>
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Acesso Seguro MenuX Flex
          </div>
        </div>
      </div>
    </div>
  );
};

