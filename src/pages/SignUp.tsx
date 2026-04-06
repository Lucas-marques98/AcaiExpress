import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Store, 
  Globe, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  CreditCard,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useStore } from '../contexts/StoreContext';
import { StoreSegment, Plan, BillingStatus, OnboardingStatus } from '../types';
import { Button } from '../components/Button';
import { toast } from 'sonner';

const SEGMENTS: { value: StoreSegment; label: string }[] = [
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'pizzaria', label: 'Pizzaria' },
  { value: 'hamburgueria', label: 'Hamburgueria' },
  { value: 'açaiteria', label: 'Açaiteria' },
  { value: 'pastelaria', label: 'Pastelaria' },
  { value: 'lanchonete', label: 'Lanchonete' },
  { value: 'doceria', label: 'Doceria' },
  { value: 'marmitaria', label: 'Marmitaria' },
];

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 39.90,
    setupPrice: 97.00,
    description: 'Ideal para quem está começando.',
    productLimit: 50,
    bannerLimit: 0,
    adminLimit: 1,
    allowedSegments: 'all',
    features: [
      'Cardápio digital',
      'Até 50 produtos',
      'Suporte básico',
      'WhatsApp integrado'
    ],
    active: true
  },
  {
    id: 'profissional',
    name: 'Profissional',
    monthlyPrice: 59.90,
    setupPrice: 97.00,
    description: 'O melhor custo-benefício para sua loja.',
    productLimit: 9999,
    bannerLimit: 5,
    adminLimit: 2,
    allowedSegments: 'all',
    features: [
      'Cardápio digital',
      'Produtos ilimitados',
      'Banners',
      'Dashboard completo',
      'WhatsApp integrado'
    ],
    active: true
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 99.90,
    setupPrice: 97.00,
    description: 'Recursos avançados para grandes operações.',
    productLimit: 9999,
    bannerLimit: 10,
    adminLimit: 5,
    allowedSegments: 'all',
    features: [
      'Tudo do profissional',
      'Multi usuários',
      'Prioridade suporte',
      'Personalização avançada'
    ],
    active: true
  }
];

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { plans } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Responsible
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Store
    storeName: '',
    slug: '',
    segment: '' as StoreSegment,
    storeWhatsapp: '',
    storePhone: '',
    city: '',
    state: '',
    // Commercial
    planId: '',
  });

  // Auto-generate slug from store name
  useEffect(() => {
    if (formData.storeName && !formData.slug) {
      const generatedSlug = formData.storeName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.storeName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.storeName || !formData.slug || !formData.segment || !formData.storeWhatsapp || !formData.city || !formData.state) {
      setError('Por favor, preencha todos os campos da loja.');
      return false;
    }
    return true;
  };

  const checkSlugUniqueness = async (slug: string) => {
    const q = query(collection(db, 'stores'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) {
      setLoading(true);
      const isUnique = await checkSlugUniqueness(formData.slug);
      setLoading(false);
      if (!isUnique) {
        setError('Este endereço (slug) já está em uso. Escolha outro.');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.planId) {
      setError('Por favor, selecione um plano.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: formData.name });

      // Use DEFAULT_PLANS as source of truth for signup
      const selectedPlan = DEFAULT_PLANS.find(p => p.id === formData.planId);
      if (!selectedPlan) throw new Error('Plano não encontrado.');

      // 2. Create Store Document
      const storeId = doc(collection(db, 'stores')).id;
      const storeData = {
        id: storeId,
        name: formData.storeName,
        slug: formData.slug,
        segment: formData.segment,
        logo: '', // Initial empty
        banner: '', // Initial empty
        primaryColor: '#7c3aed', // Default purple
        secondaryColor: '#f3f4f6',
        whatsapp: formData.storeWhatsapp,
        phone: formData.storePhone,
        address: `${formData.city}, ${formData.state}`,
        minOrderValue: 0,
        deliveryFee: 0,
        deliveryTime: '30-60 min',
        isOpen: false,
        status: 'onboarding' as const,
        billingStatus: 'trial' as BillingStatus,
        subscriptionStatus: 'trial' as BillingStatus,
        onboardingStatus: 'pending' as OnboardingStatus,
        planId: formData.planId,
        monthlyFee: selectedPlan.monthlyPrice,
        setupFee: selectedPlan.setupPrice,
        startDate: new Date().toISOString(),
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days trial
        createdAt: new Date().toISOString(),
        openingHours: [
          { day: 'Segunda', open: '08:00', close: '22:00', closed: false },
          { day: 'Terça', open: '08:00', close: '22:00', closed: false },
          { day: 'Quarta', open: '08:00', close: '22:00', closed: false },
          { day: 'Quinta', open: '08:00', close: '22:00', closed: false },
          { day: 'Sexta', open: '08:00', close: '22:00', closed: false },
          { day: 'Sábado', open: '08:00', close: '22:00', closed: false },
          { day: 'Domingo', open: '08:00', close: '22:00', closed: true },
        ]
      };
      await setDoc(doc(db, 'stores', storeId), storeData);

      // 3. Create User Document
      const userData = {
        id: firebaseUser.uid,
        name: formData.name,
        email: formData.email,
        role: 'STORE_ADMIN',
        storeId: storeId,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // 4. Create Subscription Document
      const subscriptionId = doc(collection(db, 'subscriptions')).id;
      const subscriptionData = {
        id: subscriptionId,
        storeId: storeId,
        planId: formData.planId,
        monthlyFee: selectedPlan.monthlyPrice,
        setupFee: selectedPlan.setupPrice,
        status: 'trial' as BillingStatus,
        setupStatus: 'pending' as OnboardingStatus,
        startDate: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await setDoc(doc(db, 'subscriptions', subscriptionId), subscriptionData);

      // 5. Create Onboarding Document
      const onboardingId = doc(collection(db, 'onboarding')).id;
      const onboardingData = {
        id: onboardingId,
        storeId: storeId,
        status: 'pending' as OnboardingStatus,
        startDate: new Date().toISOString(),
        items: [
          { id: '1', label: 'Configurar dados básicos', completed: true },
          { id: '2', label: 'Cadastrar categorias', completed: false },
          { id: '3', label: 'Cadastrar primeiros produtos', completed: false },
          { id: '4', label: 'Configurar taxas de entrega', completed: false },
          { id: '5', label: 'Personalizar visual', completed: false },
        ]
      };
      await setDoc(doc(db, 'onboarding', onboardingId), onboardingData);

      toast.success('Conta criada com sucesso! Bem-vindo ao MenuX Flex.');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está sendo utilizado.');
      } else {
        setError('Ocorreu um erro ao criar sua conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0b] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">MenuX <span className="text-purple-600">Flex</span></span>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Comece sua Jornada</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Crie sua conta e coloque seu cardápio online hoje mesmo.</p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1c] rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/5 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 dark:bg-white/5 flex">
            <motion.div 
              initial={{ width: '33.33%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="h-full bg-purple-600"
            />
          </div>

          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Dados do Responsável</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ex: João Silva"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Profissional</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="joao@exemplo.com"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Telefone / Celular</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar Senha</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                      <Store className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Dados da Empresa</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Loja</label>
                      <div className="relative">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="text"
                          name="storeName"
                          value={formData.storeName}
                          onChange={handleChange}
                          placeholder="Ex: Pizzaria do Bairro"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Endereço do Cardápio (Slug)</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">.menux.flex</div>
                        <input 
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          placeholder="pizzaria-bairro"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-24 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Segmento</label>
                      <select 
                        name="segment"
                        value={formData.segment}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all appearance-none"
                      >
                        <option value="">Selecione...</option>
                        {SEGMENTS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp da Loja</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="tel"
                          name="storeWhatsapp"
                          value={formData.storeWhatsapp}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Cidade</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Sua Cidade"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Estado</label>
                      <input 
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="UF"
                        maxLength={2}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all uppercase"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Escolha seu Plano</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {DEFAULT_PLANS.map(plan => (
                      <label 
                        key={plan.id}
                        className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all group ${
                          formData.planId === plan.id 
                            ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/10 shadow-xl shadow-purple-500/10' 
                            : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-purple-200 hover:bg-white dark:hover:bg-white/10'
                        }`}
                      >
                        {plan.id === 'profissional' && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                            Recomendado
                          </div>
                        )}

                        <input 
                          type="radio"
                          name="planId"
                          value={plan.id}
                          checked={formData.planId === plan.id}
                          onChange={handleChange}
                          className="hidden"
                        />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div className="flex items-start gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                              formData.planId === plan.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white dark:bg-[#1a1a1c] text-gray-400 border border-gray-100 dark:border-white/5'
                            }`}>
                              {plan.id === 'starter' && <Zap className="w-7 h-7" />}
                              {plan.id === 'profissional' && <ShieldCheck className="w-7 h-7" />}
                              {plan.id === 'premium' && <CreditCard className="w-7 h-7" />}
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{plan.description}</p>
                              
                              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                {plan.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="text-left sm:text-right flex-shrink-0 pt-6 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-white/5">
                            <div className="flex items-baseline sm:justify-end gap-1">
                              <span className="text-sm font-black text-gray-400">R$</span>
                              <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                                {plan.monthlyPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">por mês</p>
                            
                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Setup:</span>
                              <span className="text-xs font-black text-purple-600">R$ {plan.setupPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>

                        {formData.planId === plan.id && (
                          <motion.div 
                            layoutId="check-badge"
                            className="absolute top-6 right-6 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                        )}
                      </label>
                    ))}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/20 flex items-start gap-4 mt-8">
                    <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-blue-900 dark:text-blue-100 mb-1">Início com 7 dias grátis</h4>
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300 leading-relaxed">
                        Sua assinatura começará no modo Trial. Você terá acesso total por 7 dias antes da primeira cobrança.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              {step > 1 && (
                <button 
                  onClick={handleBack}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white font-black rounded-[2rem] transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
              )}
              
              <button 
                onClick={step === 3 ? handleSubmit : handleNext}
                disabled={loading}
                className={`flex-1 w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {step === 3 ? 'Finalizar Cadastro' : 'Continuar'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Já tem uma conta?{' '}
                <Link to="/admin/login" className="text-purple-600 font-black hover:underline">Fazer Login</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Ambiente Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Pagamento Criptografado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
