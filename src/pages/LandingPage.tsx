import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Store, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  MessageSquare,
  ChevronRight,
  Star,
  Users,
  Layout,
  Clock,
  CreditCard,
  Plus,
  Layers,
  ImageIcon,
  Percent,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Check,
  Globe,
  Palette,
  ClipboardList,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Pizza,
  Hamburger,
  IceCream,
  Box,
  Cake,
  Sandwich,
  ShoppingBag,
  Package,
  Sun,
  Moon,
  Utensils
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-white/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-black text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
          {question}
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f11] transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                MenuX <span className="text-purple-600">Flex</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#beneficios" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Benefícios</a>
              <a href="#segmentos" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Segmentos</a>
              <a href="#como-funciona" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Como Funciona</a>
              <a href="#planos" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Planos</a>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/admin/login" className="hidden sm:block text-sm font-black text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors">
                Entrar
              </Link>
              <Link to="/cadastro" className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-black text-sm hover:bg-purple-700 transition-all shadow-xl shadow-purple-200">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[120px] opacity-50 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-widest mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              A Nova Era do Delivery Local
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-[7rem] font-black text-gray-900 dark:text-white leading-[0.95] mb-8 tracking-tighter"
            >
              Venda mais com um cardápio <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">irresistível.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-medium"
            >
              O MenuX Flex é a plataforma SaaS completa para gerenciar seu negócio, receber pedidos via WhatsApp e encantar seus clientes com um design premium.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/cadastro" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-purple-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl hover:bg-purple-700 transition-all shadow-2xl shadow-purple-200 dark:shadow-none group active:scale-95">
                Assinar Agora
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-white/5 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-white/10 px-12 py-6 rounded-[2.5rem] font-black text-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-95">
                <PlayCircle className="w-6 h-6 text-purple-600" />
                Ver Demonstração
              </button>
            </motion.div>
          </div>

          {/* Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="mt-32 relative max-w-6xl mx-auto"
          >
            <div className="relative z-10 bg-white dark:bg-[#1a1a1c] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[12px] border-white dark:border-[#1a1a1c] overflow-hidden aspect-[16/10] group">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                alt="Dashboard Preview" 
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-sm">
                <div className="bg-white dark:bg-[#1a1a1c] p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-black text-gray-900 dark:text-white">Assistir Tour do Sistema</span>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-16 top-1/4 z-20 bg-white dark:bg-[#252529] p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 dark:border-white/5 hidden lg:flex items-center gap-5"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest leading-none mb-2">Novo Pedido</p>
                <p className="text-xl font-black text-gray-900 dark:text-white leading-none">WhatsApp Recebido!</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-16 bottom-1/4 z-20 bg-white dark:bg-[#252529] p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 dark:border-white/5 hidden lg:flex items-center gap-5"
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest leading-none mb-2">Crescimento</p>
                <p className="text-xl font-black text-gray-900 dark:text-white leading-none">+45% este mês</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-32 bg-gray-50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-purple-600 font-black uppercase tracking-widest text-sm mb-4">Benefícios Reais</h2>
            <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">Por que escolher o MenuX Flex?</h3>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Focamos na experiência do seu cliente e na facilidade da sua gestão.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Cardápio Digital Premium",
                desc: "Uma experiência de compra fluida, rápida e visualmente impactante para seus clientes no celular."
              },
              {
                icon: Layout,
                title: "Painel Administrativo",
                desc: "Gestão simplificada de produtos, categorias e banners. Tudo sob seu controle em tempo real."
              },
              {
                icon: Palette,
                title: "Personalização Total",
                desc: "Sua marca, suas cores. Adapte a identidade visual da loja para refletir o DNA do seu negócio."
              },
              {
                icon: ClipboardList,
                title: "Gestão de Pedidos",
                desc: "Acompanhe o status de cada pedido, desde a preparação até a entrega final ao cliente."
              },
              {
                icon: Globe,
                title: "Branding Próprio",
                desc: "Use seu próprio domínio e fortaleça sua marca no mercado digital sem depender de marketplaces."
              },
              {
                icon: MessageSquare,
                title: "WhatsApp Integrado",
                desc: "Receba pedidos organizados e prontos para produção diretamente no seu WhatsApp."
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1a1a1c] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{benefit.title}</h4>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section id="segmentos" className="py-32 bg-white dark:bg-[#0f0f11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-purple-600 font-black uppercase tracking-widest text-sm mb-4">Segmentos Atendidos</h2>
              <h3 className="text-4xl lg:text-7xl font-black text-gray-900 dark:text-white mb-10 leading-[1.1]">
                Feito para o <span className="text-purple-600">seu</span> nicho.
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Restaurantes", icon: Utensils },
                  { name: "Pizzarias", icon: Pizza },
                  { name: "Hamburguerias", icon: Hamburger },
                  { name: "Açaiterias", icon: IceCream },
                  { name: "Pastelarias", icon: Box },
                  { name: "Docerias", icon: Cake },
                  { name: "Lanchonetes", icon: Sandwich },
                  { name: "Marmitarias", icon: Package }
                ].map((segment, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 font-black text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm">
                      <segment.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    {segment.name}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop" className="rounded-[3rem] shadow-2xl" alt="Pizza" />
                <img src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop" className="rounded-[3rem] shadow-2xl" alt="Burger" />
              </div>
              <div className="space-y-6">
                <img src="https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=800&auto=format&fit=crop" className="rounded-[3rem] shadow-2xl" alt="Acai" />
                <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop" className="rounded-[3rem] shadow-2xl" alt="Sushi" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-32 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-purple-400 font-black uppercase tracking-widest text-sm mb-4">Simplicidade</h2>
            <h3 className="text-4xl lg:text-6xl font-black mb-8">Como funciona?</h3>
            <p className="text-xl text-gray-400 font-medium">Do contrato à primeira venda em tempo recorde.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Connector Line */}
            <div className="absolute top-12 left-0 w-full h-0.5 bg-gray-800 hidden md:block z-0" />
            
            {[
              { step: "01", title: "Contratar", desc: "Escolha o plano ideal e realize o pagamento do setup.", icon: CreditCard },
              { step: "02", title: "Implantar", desc: "Nossa equipe configura sua estrutura base em 24h.", icon: Zap },
              { step: "03", title: "Personalizar", desc: "Adicione seus produtos, fotos e cores da sua marca.", icon: Palette },
              { step: "04", title: "Vender", desc: "Divulgue seu link e receba pedidos no WhatsApp.", icon: ShoppingBag }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 text-center group">
                <div className="w-24 h-24 bg-gray-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-4 border-gray-900 group-hover:bg-purple-600 transition-all duration-500">
                  <item.icon className="w-10 h-10 text-purple-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-purple-400 font-black text-sm mb-2 block tracking-widest">{item.step}</span>
                <h4 className="text-2xl font-black mb-4">{item.title}</h4>
                <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white dark:bg-[#0f0f11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-purple-600 font-black uppercase tracking-widest text-sm mb-4">Poder de Gestão</h2>
              <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
                Funcionalidades pensadas para o seu <span className="text-purple-600">sucesso.</span>
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: ImageIcon, title: "Banners", desc: "Destaque promoções com banners rotativos." },
                  { icon: Package, title: "Produtos", desc: "Cadastro completo com variações e adicionais." },
                  { icon: Layers, title: "Categorias", desc: "Organize seu cardápio de forma inteligente." },
                  { icon: Percent, title: "Promoções", desc: "Crie ofertas e cupons de desconto reais." },
                  { icon: ShoppingBag, title: "Pedidos", desc: "Gestão de status e histórico completo." },
                  { icon: BarChart3, title: "Dashboard", desc: "Métricas de vendas e produtos populares." },
                  { icon: Palette, title: "Identidade", desc: "Cores e logo totalmente customizáveis." },
                  { icon: ShieldCheck, title: "Assinatura", desc: "Gestão de fatura e plano direto no painel." }
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-black text-gray-900 dark:text-white mb-1">{f.title}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-100 dark:bg-white/5 rounded-[3rem] p-4 aspect-square flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Analytics" 
                  className="rounded-[2.5rem] shadow-2xl w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white dark:bg-[#1a1a1c] p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 max-w-xs">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-black text-gray-900 dark:text-white">Loja Configurada</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sua loja está pronta para receber pedidos e crescer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-32 bg-gray-50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-purple-600 font-black uppercase tracking-widest text-sm mb-4">Planos SaaS</h2>
            <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">Transparência total.</h3>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Sem comissões por venda. Você paga apenas o valor fixo mensal.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Start",
                price: "49,90",
                setup: "199,00",
                features: ["Até 50 produtos", "1 Banner rotativo", "Suporte via Email", "Relatórios de vendas", "Subdomínio MenuX"],
                recommended: false
              },
              {
                name: "Pro",
                price: "99,90",
                setup: "299,00",
                features: ["Produtos Ilimitados", "5 Banners rotativos", "Suporte via WhatsApp", "Cupons de Desconto", "Relatórios Avançados", "Gestão de Clientes"],
                recommended: true
              },
              {
                name: "Enterprise",
                price: "199,90",
                setup: "499,00",
                features: ["Tudo do Pro", "10 Banners rotativos", "Domínio Próprio", "Gestão de Entregadores", "Programa de Fidelidade", "Prioridade no Suporte"],
                recommended: false
              }
            ].map((plan, idx) => (
              <div key={idx} className={cn(
                "relative p-12 rounded-[3.5rem] border transition-all duration-500",
                plan.recommended 
                  ? "bg-white dark:bg-[#1a1a1c] text-gray-900 dark:text-white border-purple-500 shadow-[0_30px_60px_-15px_rgba(107,33,168,0.2)] scale-105 z-10" 
                  : "bg-white/50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-900 dark:text-white"
              )}>
                {plan.recommended && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                    Mais Recomendado
                  </div>
                )}
                <h4 className="text-2xl font-black mb-6">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-sm font-bold">R$</span>
                  <span className="text-6xl font-black">{plan.price}</span>
                  <span className="text-sm font-bold text-gray-400">/mês</span>
                </div>
                <p className="text-sm font-black text-purple-600 dark:text-purple-400 mb-10">
                  + Taxa de setup única: R$ {plan.setup}
                </p>
                
                <div className="space-y-5 mb-12">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3 font-bold text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <Link 
                  to="/cadastro" 
                  className={cn(
                    "block text-center py-5 rounded-[2rem] font-black text-lg transition-all",
                    plan.recommended 
                      ? "bg-purple-600 text-white hover:bg-purple-700 shadow-xl shadow-purple-200 dark:shadow-none" 
                      : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
                  )}
                >
                  Começar Agora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 bg-white dark:bg-[#0f0f11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-purple-600 font-black uppercase tracking-widest text-sm mb-4">Prova Social</h2>
                <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                  Quem usa, <span className="text-purple-600">recomenda.</span>
                </h3>
              </div>

              <div className="space-y-8">
                {[
                  {
                    name: "Ricardo Silva",
                    role: "Dono da Burger House",
                    text: "O MenuX Flex mudou nossa operação. Os pedidos chegam organizados no WhatsApp e o cardápio é lindo. Meus clientes adoram!",
                    img: "https://i.pravatar.cc/150?img=11"
                  },
                  {
                    name: "Amanda Costa",
                    role: "Gerente do Açaí do Porto",
                    text: "A facilidade de gerenciar produtos e banners pelo painel é incrível. Em menos de 24h já estávamos vendendo online.",
                    img: "https://i.pravatar.cc/150?img=32"
                  }
                ].map((t, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 relative">
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-white fill-current" />
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium italic mb-6 leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                      <img src={t.img} className="w-12 h-12 rounded-2xl object-cover" alt={t.name} />
                      <div>
                        <h5 className="font-black text-gray-900 dark:text-white leading-none mb-1">{t.name}</h5>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Lojas Ativas", value: "500+", icon: Store },
                { label: "Pedidos/Mês", value: "150k+", icon: ShoppingBag },
                { label: "Usuários Felizes", value: "10k+", icon: Users },
                { label: "Uptime", value: "99.9%", icon: Zap }
              ].map((m, i) => (
                <div key={i} className="bg-purple-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-purple-200 dark:shadow-none odd:mt-12">
                  <m.icon className="w-10 h-10 mb-6 opacity-50" />
                  <p className="text-4xl font-black mb-2">{m.value}</p>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-80">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-gray-50 dark:bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-purple-600 font-black uppercase tracking-widest text-sm mb-4">FAQ</h2>
            <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">Dúvidas Comuns</h3>
          </div>

          <div className="bg-white dark:bg-[#1a1a1c] rounded-[3rem] p-8 sm:p-12 border border-gray-100 dark:border-white/5 shadow-sm">
            <FAQItem 
              question="Como recebo os pedidos?" 
              answer="Todos os pedidos realizados no seu cardápio digital chegam organizados e detalhados diretamente no WhatsApp configurado na sua loja." 
            />
            <FAQItem 
              question="Existe taxa por venda?" 
              answer="Não! O MenuX Flex é uma plataforma SaaS com mensalidade fixa. Você não paga comissão sobre suas vendas, independente do volume." 
            />
            <FAQItem 
              question="Quanto tempo demora a implantação?" 
              answer="Após a contratação e pagamento do setup, nossa equipe configura sua estrutura base em até 24 horas úteis." 
            />
            <FAQItem 
              question="Posso usar meu próprio domínio?" 
              answer="Sim! No plano Enterprise você pode configurar seu próprio domínio (ex: www.sualoja.com.br) para fortalecer sua marca." 
            />
            <FAQItem 
              question="Como funciona o suporte?" 
              answer="Oferecemos suporte via email nos planos iniciais e suporte prioritário via WhatsApp nos planos Pro e Enterprise." 
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-white dark:bg-[#0f0f11] border-t border-gray-100 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                  MenuX <span className="text-purple-600">Flex</span>
                </span>
              </div>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed font-medium">
                A solução definitiva para o seu delivery. Tecnologia, design e simplicidade para escalar o seu negócio local.
              </p>
            </div>
            <div>
              <h5 className="font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest text-xs">Plataforma</h5>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400 font-bold text-sm">
                <li><a href="#beneficios" className="hover:text-purple-600 transition-colors">Benefícios</a></li>
                <li><a href="#segmentos" className="hover:text-purple-600 transition-colors">Segmentos</a></li>
                <li><a href="#como-funciona" className="hover:text-purple-600 transition-colors">Como Funciona</a></li>
                <li><a href="#planos" className="hover:text-purple-600 transition-colors">Planos</a></li>
                <li><Link to="/admin/login" className="hover:text-purple-600 transition-colors">Acesso Administrativo</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest text-xs">Suporte</h5>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400 font-bold text-sm">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">WhatsApp Comercial</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-400 font-bold text-sm">
              © 2026 MenuX Flex. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                Ambiente Seguro
              </div>
              <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                <CreditCard className="w-5 h-5" />
                Pagamento Protegido
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/5500000000000"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-200 dark:shadow-none hover:bg-[#128C7E] transition-colors"
      >
        <MessageSquare className="w-8 h-8 fill-current" />
      </motion.a>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-md border-t border-gray-100 dark:border-white/10 z-40">
        <Link to="/cadastro" className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-purple-200 dark:shadow-none">
          Começar Agora
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
