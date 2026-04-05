import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, ShoppingBag, Search, User, MapPin, Clock, Star, ChevronRight } from 'lucide-react';
import { categories, products, storeConfig } from '../mockData';
import { formatCurrency, cn } from '../lib/utils';
import { Button } from '../components/Button';
import { ProductModal } from '../components/ProductModal';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { cartCount, cartTotal } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <img src={storeConfig.logo} alt="Logo" className="w-7 h-7 invert" />
            </div>
            <div>
              <h1 className="font-black text-lg text-primary leading-none">Açaí Express</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Premium Delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-6 h-6 text-gray-500" />
            </button>
            <button 
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <User className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto relative rounded-[2rem] overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          <img
            src={storeConfig.banner}
            alt="Banner"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                Promoção de Hoje
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2">O Açaí mais cremoso de Taboão!</h2>
              <p className="text-white/80 text-sm md:text-lg mb-6 max-w-md">Peça agora e receba em até 40 minutos no conforto da sua casa.</p>
              <Button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-2xl">
                Peça Agora
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Store Info Cards */}
      <section className="px-4 py-2">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-3xl premium-shadow flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Entrega</p>
            <p className="text-xs font-bold">Taboão da Serra</p>
          </div>
          <div className="bg-white p-4 rounded-3xl premium-shadow flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Tempo</p>
            <p className="text-xs font-bold">{storeConfig.deliveryTime}</p>
          </div>
          <div className="bg-white p-4 rounded-3xl premium-shadow flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-accent" />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Avaliação</p>
            <p className="text-xs font-bold">4.9 (500+)</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 overflow-hidden" id="menu">
        <div className="px-4 mb-4 flex items-center justify-between max-w-7xl mx-auto">
          <h3 className="text-xl font-black text-gray-900">Categorias</h3>
          <button className="text-primary font-bold text-sm flex items-center">
            Ver todas <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar max-w-7xl mx-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all",
              selectedCategory === 'all' ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white text-gray-500"
            )}
          >
            Tudo
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all",
                selectedCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white text-gray-500"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 py-2">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              layout
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-[2.5rem] overflow-hidden premium-shadow group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-accent text-gray-900 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    Destaque
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-primary shadow-xl">
                  {formatCurrency(product.price)}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-black text-gray-900 mb-2">{product.name}</h4>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">A partir de</span>
                  <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-4 right-4 z-50 max-w-lg mx-auto"
        >
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-primary text-white p-5 rounded-3xl shadow-2xl shadow-primary/40 flex items-center justify-between group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary">
                  {cartCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest leading-none mb-1">Ver Carrinho</p>
                <p className="font-black text-lg leading-none">Finalizar Pedido</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest leading-none mb-1">Total</p>
              <p className="font-black text-xl leading-none">{formatCurrency(cartTotal)}</p>
            </div>
          </button>
        </motion.div>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
