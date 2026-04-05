import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trash2, Plus, Minus, Ticket, Truck, Store, User, Phone, MapPinned, CreditCard, Send, MapPin, ShoppingBag, CheckCircle2, Pencil, ChevronDown, MessageSquare } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';
import { formatCurrency, cn } from '../lib/utils';
import { Button } from '../components/Button';
import { toast } from 'sonner';
import { DeliveryMethod, PaymentMethod, CartItem, Product } from '../types';
import { ProductModal } from '../components/ProductModal';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { products } = useStore();
  
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [editingItem, setEditingItem] = useState<{ item: CartItem, product: Product } | null>(null);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'BEMVINDO') {
      setDiscount(5);
      toast.success('Cupom aplicado! R$ 5,00 de desconto.');
    } else {
      toast.error('Cupom inválido ou expirado');
    }
  };

  const handleEditItem = (item: CartItem) => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      setEditingItem({ item, product });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] flex flex-col items-center justify-center p-6 text-center transition-colors duration-500">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-primary/5">
          <ShoppingBag className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xs font-bold">Que tal adicionar um açaí bem cremoso para começar?</p>
        <Button onClick={() => navigate('/')} className="w-full max-w-xs rounded-2xl py-4 text-lg">Ver Cardápio</Button>
      </div>
    );
  }

  const total = cartTotal - discount;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] pb-32 transition-colors duration-500">
      <header className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-white/10 px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white">Meu Carrinho</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
        <div className="space-y-4">
          {cart.map(item => (
            <motion.div layout key={item.id} className="bg-white dark:bg-white/5 p-4 rounded-[2rem] premium-shadow flex gap-4 border border-gray-100 dark:border-white/10">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-gray-900 dark:text-white truncate text-lg leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEditItem(item)} className="text-gray-400 dark:text-gray-500 hover:text-primary p-1 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                  {item.variation && <p className="text-xs font-black text-primary dark:text-primary-light mb-1">{item.variation.name}</p>}
                  {item.addons.length > 0 && (
                    <p className="text-[11px] text-gray-700 dark:text-gray-200 line-clamp-2 mb-1 leading-tight font-bold">
                      {item.addons.map(g => g.items.map(i => i.name).join(', ')).join(', ')}
                    </p>
                  )}
                  {item.observations && (
                    <p className="text-[11px] text-orange-600 dark:text-orange-400 line-clamp-2 mb-2 leading-tight font-bold bg-orange-50 dark:bg-orange-500/10 p-1.5 rounded-lg border border-orange-100 dark:border-orange-500/20">
                      <span className="font-black">Obs:</span> {item.observations}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-1 rounded-xl border border-gray-100 dark:border-white/10">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-white/10 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200"><Minus className="w-4 h-4" /></button>
                    <span className="font-black text-sm w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-white/10 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200"><Plus className="w-4 h-4" /></button>
                  </div>
                  <span className="font-black text-lg text-gray-900 dark:text-white">{formatCurrency(item.totalPrice)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] premium-shadow flex items-center gap-4 border border-gray-100 dark:border-white/10">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
            <Ticket className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Cupom de Desconto</p>
            <input 
              type="text" 
              placeholder="Ex: BEMVINDO" 
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              className="w-full font-black outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 uppercase" 
            />
          </div>
          <button 
            onClick={handleApplyCoupon}
            className="text-primary dark:text-primary-light font-black px-4 py-2 bg-primary/5 dark:bg-primary/10 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
          >
            Aplicar
          </button>
        </div>

        <div className="bg-white dark:bg-white/5 p-6 md:p-8 rounded-[2.5rem] premium-shadow space-y-4 border border-gray-100 dark:border-white/10">
          <div className="flex justify-between text-gray-700 dark:text-gray-200 font-bold text-sm md:text-base"><span>Subtotal</span><span className="font-black text-gray-900 dark:text-white">{formatCurrency(cartTotal)}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-gray-700 dark:text-gray-200 font-bold text-sm md:text-base"><span>Desconto</span><span className="font-black text-red-500">-{formatCurrency(discount)}</span></div>
          )}
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center"><span className="text-lg md:text-xl font-black text-gray-900 dark:text-white">Total</span><span className="text-2xl md:text-3xl font-black text-primary dark:text-primary-light">{formatCurrency(total)}</span></div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-xl border-t border-gray-100 dark:border-white/10 z-50 md:relative md:bg-transparent md:border-none md:p-0">
          <Button onClick={() => navigate('/checkout')} className="w-full py-5 md:py-6 text-base md:text-lg rounded-2xl md:rounded-3xl shadow-xl shadow-primary/20 font-black">
            Continuar para Checkout
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {editingItem && (
          <ProductModal
            product={editingItem.product}
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            initialCartItem={editingItem.item}
          />
        )}
      </AnimatePresence>
    </div>
  );
};


