import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ShoppingBag, 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Flame, 
  Sparkles, 
  X, 
  Sun, 
  Moon,
  ChevronRight,
  TrendingUp,
  Heart,
  Coffee,
  IceCream,
  Percent,
  Info,
  ChevronLeft,
  UtensilsCrossed,
  Pizza,
  Hamburger,
  Sandwich,
  Cake,
  Box
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

const getSegmentIcon = (segment: string) => {
  switch (segment) {
    case 'açaiteria': return IceCream;
    case 'restaurante': return UtensilsCrossed;
    case 'pizzaria': return Pizza;
    case 'hamburgueria': return Hamburger;
    case 'lanchonete': return Sandwich;
    case 'doceria': return Cake;
    case 'pastelaria': return Box;
    case 'marmitaria': return Box;
    default: return UtensilsCrossed;
  }
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, cartTotal, addToCart } = useCart();
  const { products, categories, currentStore } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Refs for horizontal scrolling
  const categoriesRef = useHorizontalScroll();
  const promosRef = useHorizontalScroll();

  if (!currentStore) return null;

  const bestSellers = products.filter(p => p.isBestSeller);
  const promos = products.filter(p => p.isPromo);
  const recommended = products.slice(0, 4);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    navigate(`/loja/${currentStore.slug}/produto/${product.id}`);
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

  const SegmentIcon = getSegmentIcon(currentStore.segment);

  return (
    <div className="min-h-screen pb-32 bg-gray-50 dark:bg-[#0f0f11] transition-colors duration-500">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-4 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/10 overflow-hidden"
            >
              <img src={currentStore.logo} alt={currentStore.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-black text-lg text-gray-900 dark:text-white leading-none">{currentStore.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <SegmentIcon className="w-3 h-3 text-primary" />
                <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-black">{currentStore.segment}</p>
              </div>
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
              onClick={() => navigate(`/loja/${currentStore.slug}/carrinho`)}
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

      {/* Store Banner & Info */}
      <section className="relative">
        <div className="h-48 md:h-64 w-full overflow-hidden">
          <img 
            src={currentStore.banner} 
            alt="Banner" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0f0f11] to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white dark:bg-[#1a1a1c] rounded-[2.5rem] p-6 md:p-8 premium-shadow border border-gray-100 dark:border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-[#1a1a1c] shadow-2xl flex-shrink-0">
                  <img src={currentStore.logo} alt={currentStore.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{currentStore.name}</h2>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1 text-accent">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-black text-sm">4.9</span>
                    </div>
                    <div className="h-1 w-1 bg-gray-300 rounded-full" />
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 capitalize">{currentStore.segment}</span>
                    <div className="h-1 w-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-2 h-2 rounded-full", currentStore.isOpen ? "bg-green-500" : "bg-red-500")} />
                      <span className={cn("text-sm font-black", currentStore.isOpen ? "text-green-500" : "text-red-500")}>
                        {currentStore.isOpen ? 'Aberto' : 'Fechado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-6 border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/10 pt-6 md:pt-0 md:pl-10">
                <div className="flex-1 md:flex-none text-center md:text-left">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Tempo</p>
                  <div className="flex items-center justify-center md:justify-start gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-black text-gray-900 dark:text-white">{currentStore.deliveryTime}</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-100 dark:bg-white/10 hidden md:block" />
                <div className="flex-1 md:flex-none text-center md:text-left">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Mínimo</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(currentStore.minOrderValue)}</p>
                </div>
                <button className="p-3 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-primary transition-all">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="py-8 overflow-hidden" id="menu">
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">Categorias</h3>
        </div>
        <div 
          ref={categoriesRef}
          className="flex gap-3 overflow-x-auto px-4 pb-4 no-scrollbar max-w-7xl mx-auto snap-x cursor-grab active:cursor-grabbing"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "flex-shrink-0 px-6 py-3 rounded-2xl font-black transition-all border-2 snap-start premium-shadow",
              selectedCategory === 'all' 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-white/10 hover:border-primary/30"
            )}
          >
            Todos
          </motion.button>
          
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex-shrink-0 px-6 py-3 rounded-2xl font-black transition-all border-2 snap-start premium-shadow",
                selectedCategory === cat.id 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-white/10 hover:border-primary/30"
              )}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Daily Promos Section */}
      {promos.length > 0 && selectedCategory === 'all' && (
        <section className="py-8">
          <div className="px-4 mb-6 flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Percent className="w-7 h-7 text-green-500" /> Promoções Imperdíveis
              </h3>
            </div>
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
                    Promoção
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
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full Menu Grid */}
      <section className="px-4 py-8" id="full-menu">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {selectedCategory === 'all' ? 'Cardápio' : categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{filteredProducts.length} itens</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden premium-shadow group cursor-pointer flex p-4 gap-5 border border-gray-100 dark:border-white/10 hover:border-primary/20 dark:hover:border-primary/40 transition-all"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden flex-shrink-0 shadow-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-1 leading-tight">{product.name}</h4>
                    <p className="text-gray-700 dark:text-gray-200 text-xs line-clamp-2 font-bold">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-black text-xl text-primary dark:text-primary-light">{formatCurrency(product.price)}</span>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
                      onClick={(e) => handleAddClick(e, product)}
                    >
                      <Plus className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-8 left-4 right-4 z-50 max-w-lg mx-auto"
        >
          <button
            onClick={() => navigate(`/loja/${currentStore.slug}/carrinho`)}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between group active:scale-95 transition-all border border-gray-800 dark:border-gray-200"
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

