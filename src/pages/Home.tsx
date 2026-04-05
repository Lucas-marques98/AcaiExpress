import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ShoppingBag, 
  Search, 
  User, 
  MapPin, 
  Clock, 
  Star, 
  Flame, 
  Sparkles, 
  MessageCircle, 
  X, 
  Sun, 
  Moon,
  ChevronRight,
  TrendingUp,
  Heart,
  Coffee,
  IceCream,
  Percent
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { Button } from '../components/Button';
import { ProductModal } from '../components/ProductModal';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

// Hook for horizontal scroll with mouse wheel
const useHorizontalScroll = () => {
  const elRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 2,
          behavior: 'smooth'
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);
  return elRef;
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, cartTotal, addToCart } = useCart();
  const { products, categories, storeConfig } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Refs for horizontal scrolling
  const categoriesRef = useHorizontalScroll();
  const promosRef = useHorizontalScroll();
  const bestSellersRef = useHorizontalScroll();
  const drinksRef = useHorizontalScroll();

  const bestSellers = products.filter(p => p.isBestSeller);
  const promos = products.filter(p => p.isPromo);
  const recommended = products.slice(0, 4); // Mock recommended
  const drinks = products.filter(p => p.categoryId === 'c3'); // Assuming c3 is drinks

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const customProduct = products.find(p => p.id === 'p2'); // "Monte seu Açaí"

  const handleProductClick = (product: Product) => {
    navigate(`/produto/${product.id}`);
  };

  const handleAddClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const hasVariations = product.variations && product.variations.length > 0;
    const hasAddons = product.addonGroups && product.addonGroups.length > 0;
    
    if (!hasVariations && !hasAddons) {
      addToCart(product);
    } else {
      setSelectedProduct(product);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-gray-50 dark:bg-[#0f0f11] transition-colors duration-500">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-4 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <img src={storeConfig.logo} alt="Logo" className="w-7 h-7 invert" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-black text-lg text-gray-900 dark:text-white leading-none">Açaí Express</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary dark:text-primary-light font-black">Premium Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.button>
            
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                "p-2.5 rounded-full transition-all", 
                isSearchOpen 
                  ? "bg-primary text-white shadow-lg shadow-primary/30" 
                  : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20"
              )}
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => navigate('/carrinho')}
              className="p-2.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-all relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0f0f11]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 max-w-7xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="O que você quer comer hoje?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold text-gray-900 dark:text-white placeholder:text-gray-400"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Banner */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto relative rounded-[2.5rem] overflow-hidden aspect-[4/3] md:aspect-[21/9] premium-shadow group">
          <img
            src={storeConfig.banner}
            alt="Banner"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-accent text-gray-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                  <Sparkles className="w-3.5 h-3.5" /> Destaque da Semana
                </span>
                <span className="bg-white/30 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Mais Popular
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-lg">Monte seu Açaí<br/>do seu jeito!</h2>
              <p className="text-white text-xs sm:text-sm md:text-xl mb-6 md:mb-8 max-w-xl font-bold drop-shadow-md">Escolha o tamanho, os cremes e as frutas. Entregamos na sua porta em minutos com a qualidade que você merece.</p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Button 
                  onClick={() => customProduct && navigate(`/produto/${customProduct.id}`)} 
                  className="rounded-2xl bg-white text-primary hover:bg-gray-100 shadow-2xl px-6 md:px-8 py-4 md:py-6 text-sm md:text-lg font-black"
                >
                  Montar Agora
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-2xl border-white/30 text-white hover:bg-white/10 backdrop-blur-md px-6 md:px-8 py-4 md:py-6 text-sm md:text-lg font-black"
                >
                  Ver Cardápio
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Store Info Cards */}
      <section className="px-4 py-2">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-white/5 p-4 rounded-[2rem] premium-shadow flex flex-row sm:flex-col items-center sm:text-center border border-gray-100 dark:border-white/10 gap-4 sm:gap-0"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center sm:mb-3 flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mb-1">Entrega</p>
              <p className="text-xs font-black text-gray-900 dark:text-white">Taboão da Serra</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-white/5 p-4 rounded-[2rem] premium-shadow flex flex-row sm:flex-col items-center sm:text-center border border-gray-100 dark:border-white/10 gap-4 sm:gap-0"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center sm:mb-3 flex-shrink-0">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mb-1">Tempo</p>
              <p className="text-xs font-black text-gray-900 dark:text-white">{storeConfig.deliveryTime}</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-white/5 p-4 rounded-[2rem] premium-shadow flex flex-row sm:flex-col items-center sm:text-center border border-gray-100 dark:border-white/10 gap-4 sm:gap-0"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center sm:mb-3 flex-shrink-0">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mb-1">Avaliação</p>
              <p className="text-xs font-black text-gray-900 dark:text-white">4.9 (500+)</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="py-6 overflow-hidden" id="menu">
        <div 
          ref={categoriesRef}
          className="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar max-w-7xl mx-auto snap-x cursor-grab active:cursor-grabbing"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategory('all');
              document.getElementById('full-menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={cn(
              "flex-shrink-0 flex flex-col items-center gap-3 px-6 py-5 rounded-[2rem] font-black transition-all border-2 snap-start min-w-[110px] premium-shadow",
              selectedCategory === 'all' 
                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-white/10 hover:border-primary/30"
            )}
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", selectedCategory === 'all' ? "bg-white/20" : "bg-gray-100 dark:bg-white/10")}>
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase tracking-widest font-black">Todos</span>
          </motion.button>
          
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCategory(cat.id);
                document.getElementById('full-menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-3 px-6 py-5 rounded-[2rem] font-black transition-all border-2 snap-start min-w-[110px] premium-shadow",
                selectedCategory === cat.id 
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                  : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-white/10 hover:border-primary/30"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", selectedCategory === cat.id ? "bg-white/20" : "bg-gray-100 dark:bg-white/10")}>
                {cat.id === '1' ? <IceCream className="w-6 h-6" /> : cat.id === '3' ? <Coffee className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
              </div>
              <span className="text-xs uppercase tracking-widest font-black">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Daily Promos Section */}
      {promos.length > 0 && (
        <section className="py-8">
          <div className="px-4 mb-6 flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Percent className="w-7 h-7 text-green-500" /> Promoções do Dia
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-bold text-sm">Aproveite os melhores preços de hoje</p>
            </div>
            <button 
              onClick={() => document.getElementById('full-menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary dark:text-primary-light font-black text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              Ver tudo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div 
            ref={promosRef}
            className="flex gap-4 md:gap-6 overflow-x-auto px-4 pb-6 no-scrollbar max-w-7xl mx-auto snap-x cursor-grab active:cursor-grabbing"
          >
            {promos.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden premium-shadow flex-shrink-0 w-[280px] md:w-80 cursor-pointer group border border-gray-100 dark:border-white/10 snap-start"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                    Economize Agora
                  </div>
                  <div className="absolute bottom-4 right-4 glass px-4 py-2 rounded-2xl font-black text-primary dark:text-primary-light shadow-xl text-lg">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h4>
                  <p className="text-gray-700 dark:text-gray-200 text-sm line-clamp-2 mb-4 font-bold">{product.description}</p>
                  <Button 
                    className="w-full rounded-2xl py-4 font-black shadow-lg shadow-primary/20"
                    onClick={(e) => handleAddClick(e, product)}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="py-8 bg-primary/5 dark:bg-white/5 transition-colors">
          <div className="px-4 mb-6 flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Flame className="w-7 h-7 text-orange-500" /> Mais Vendidos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-bold text-sm">Os favoritos da galera em Taboão</p>
            </div>
          </div>
          <div 
            ref={bestSellersRef}
            className="flex gap-4 md:gap-6 overflow-x-auto px-4 pb-6 no-scrollbar max-w-7xl mx-auto snap-x cursor-grab active:cursor-grabbing"
          >
            {bestSellers.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white dark:bg-[#1a1a1c] rounded-[2.5rem] overflow-hidden premium-shadow flex-shrink-0 w-64 md:w-72 cursor-pointer group border border-gray-100 dark:border-white/10 snap-start"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-gray-900 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                    Favorito
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-black text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h4>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-black text-2xl text-primary dark:text-primary-light">{formatCurrency(product.price)}</span>
                    <button 
                      className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-all"
                      onClick={(e) => handleAddClick(e, product)}
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-7 h-7 text-red-500" /> Recomendados para Você
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-bold text-sm">Baseado no que você mais gosta</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {recommended.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 premium-shadow border border-gray-100 dark:border-white/10 cursor-pointer group flex flex-col"
                >
                  <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="font-black text-sm md:text-base text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h4>
                  <p className="text-gray-700 dark:text-gray-200 text-[10px] md:text-xs font-bold mb-3 md:mb-4 line-clamp-2">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-black text-sm md:text-base text-primary dark:text-primary-light">{formatCurrency(product.price)}</span>
                    <button 
                      className="p-1.5 md:p-2 bg-gray-100 dark:bg-white/10 rounded-lg md:rounded-xl text-gray-700 dark:text-gray-200 group-hover:bg-primary group-hover:text-white transition-all"
                      onClick={(e) => handleAddClick(e, product)}
                    >
                      <Plus className="w-4 h-4 md:w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Full Menu Grid */}
      <section className="px-4 py-8" id="full-menu">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {selectedCategory === 'all' ? 'Cardápio Completo' : categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-black bg-white dark:bg-white/5 px-4 py-2 rounded-xl border dark:border-white/10 w-fit">
              <span>{filteredProducts.length} itens encontrados</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white dark:bg-white/5 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden premium-shadow group cursor-pointer flex p-3 md:p-4 gap-4 md:gap-5 border border-gray-100 dark:border-white/10 hover:border-primary/20 dark:hover:border-primary/40 transition-all"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden flex-shrink-0 shadow-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base md:text-lg font-black text-gray-900 dark:text-white mb-1 leading-tight">{product.name}</h4>
                    <p className="text-gray-700 dark:text-gray-200 text-[10px] md:text-xs line-clamp-2 font-bold">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 md:mt-3">
                    <span className="font-black text-lg md:text-xl text-primary dark:text-primary-light">{formatCurrency(product.price)}</span>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 dark:bg-primary/20 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-primary dark:text-primary-light"
                      onClick={(e) => handleAddClick(e, product)}
                    >
                      <Plus className="w-5 h-5 md:w-6 h-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Block */}
      <section className="px-4 py-12">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="max-w-7xl mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-[3rem] p-10 text-white premium-shadow relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center mb-6 mx-auto md:mx-0 backdrop-blur-md">
                <MessageCircle className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Peça pelo WhatsApp em segundos!</h3>
              <p className="text-green-50 text-lg max-w-xl font-medium opacity-90">
                Adicione seus itens favoritos, personalize do seu jeito e envie o pedido direto para nossa cozinha. Rápido, prático e sem taxas extras!
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <Button 
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-green-600 hover:bg-green-50 rounded-[1.5rem] px-10 py-7 text-xl font-black shadow-2xl whitespace-nowrap"
              >
                Começar Pedido
              </Button>
              <p className="text-center text-xs font-bold uppercase tracking-widest opacity-70">Atendimento em tempo real</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-8 left-4 right-4 z-50 max-w-lg mx-auto"
        >
          <button
            onClick={() => navigate('/carrinho')}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-6 rounded-[2.5rem] shadow-2xl shadow-primary/40 flex items-center justify-between group active:scale-95 transition-all border border-gray-800 dark:border-gray-200"
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 bg-accent text-gray-900 text-xs font-black h-6 px-2 rounded-full flex items-center justify-center border-4 border-gray-900 dark:border-white">
                  {cartCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1.5">Finalizar Agora</p>
                <p className="font-black text-xl leading-none">Ver Carrinho</p>
              </div>
            </div>
            <div className="text-right pr-2">
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1.5">Total</p>
              <p className="font-black text-2xl leading-none text-primary">{formatCurrency(cartTotal)}</p>
            </div>
          </button>
        </motion.div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

