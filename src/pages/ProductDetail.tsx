import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useCart } from '../contexts/CartContext';
import { formatCurrency, cn } from '../lib/utils';
import { Button } from '../components/Button';
import { Product, ProductVariation, AddonGroup, AddonItem } from '../types';
import { toast } from 'sonner';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useStore();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, AddonItem[]>>({});
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (product) {
      if (product.variations && product.variations.length > 0) {
        setSelectedVariation(product.variations[0]);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Produto não encontrado</h2>
        <Button onClick={() => navigate('/')}>Voltar ao Cardápio</Button>
      </div>
    );
  }

  const handleAddonToggle = (group: AddonGroup, item: AddonItem) => {
    const currentSelected = selectedAddons[group.id] || [];
    const isSelected = currentSelected.find(i => i.id === item.id);

    if (isSelected) {
      setSelectedAddons({
        ...selectedAddons,
        [group.id]: currentSelected.filter(i => i.id !== item.id)
      });
    } else {
      if (group.maxChoices && currentSelected.length >= group.maxChoices) {
        if (group.maxChoices === 1) {
          setSelectedAddons({
            ...selectedAddons,
            [group.id]: [item]
          });
        } else {
          toast.error(`Limite de ${group.maxChoices} itens para ${group.name}`);
        }
        return;
      }
      setSelectedAddons({
        ...selectedAddons,
        [group.id]: [...currentSelected, item]
      });
    }
  };

  const calculateTotal = () => {
    let total = selectedVariation ? selectedVariation.price : product.price;
    
    Object.values(selectedAddons).forEach((groupItems) => {
      if (Array.isArray(groupItems)) {
        groupItems.forEach(item => {
          total += item.price || 0;
        });
      }
    });
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    // Validate minChoices for each addon group
    if (product.addonGroups) {
      for (const group of product.addonGroups) {
        const selectedCount = selectedAddons[group.id]?.length || 0;
        if (group.minChoices && selectedCount < group.minChoices) {
          toast.error(`Por favor, selecione pelo menos ${group.minChoices} opções para ${group.name}`);
          return;
        }
      }
    }

    const addonGroups = product.addonGroups?.map(group => ({
      groupId: group.id,
      groupName: group.name,
      items: selectedAddons[group.id] || []
    })).filter(g => g.items.length > 0) || [];

    addToCart(product, selectedVariation || undefined, addonGroups, observations, quantity);
    navigate('/carrinho');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f11] pb-32 transition-colors duration-500">
      <div className="relative h-64 md:h-[50vh]">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 -mt-12 relative z-10">
        <div className="bg-white dark:bg-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-2xl shadow-black/5 border border-gray-50 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isBestSeller && (
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Mais Vendido
                  </span>
                )}
                {product.isPromo && (
                  <span className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Promoção
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{product.name}</h1>
            </div>
            <div className="md:text-right">
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">A partir de</p>
              <p className="text-2xl md:text-3xl font-black text-primary dark:text-primary-light">{formatCurrency(product.price)}</p>
            </div>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 font-bold text-base md:text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-10">
            {/* Variations */}
            {product.variations && product.variations.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Escolha o Tamanho</h3>
                  <span className="bg-primary/5 text-primary dark:text-primary-light px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Obrigatório</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {product.variations.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      className={cn(
                        "flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-all",
                        selectedVariation?.id === v.id 
                          ? "border-primary bg-primary/5 dark:bg-primary/10" 
                          : "border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", selectedVariation?.id === v.id ? "border-primary" : "border-gray-300 dark:border-white/20")}>
                          {selectedVariation?.id === v.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{v.name}</span>
                      </div>
                      <span className="font-black text-gray-900 dark:text-white">{formatCurrency(v.price)}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Addons */}
            {product.addonGroups?.map(group => (
              <section key={group.id}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">{group.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      {group.minChoices ? `Mínimo ${group.minChoices}` : ''} 
                      {group.maxChoices ? ` • Máximo ${group.maxChoices}` : ''}
                    </p>
                  </div>
                  {group.minChoices ? (
                    <span className="bg-primary/5 text-primary dark:text-primary-light px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Obrigatório</span>
                  ) : (
                    <span className="bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Opcional</span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {group.items.map(item => {
                    const isSelected = selectedAddons[group.id]?.find(i => i.id === item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleAddonToggle(group, item)}
                        className={cn(
                          "flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-all",
                          isSelected 
                            ? "border-primary bg-primary/5 dark:bg-primary/10" 
                            : "border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-5 h-5 rounded-lg border-2 flex items-center justify-center", isSelected ? "border-primary bg-primary" : "border-gray-300 dark:border-white/20")}>
                            {isSelected && <Plus className="w-3.5 h-3.5 text-white stroke-[4]" />}
                          </div>
                          <span className="font-bold text-gray-700 dark:text-gray-200">{item.name}</span>
                        </div>
                        {item.price > 0 && <span className="font-black text-primary dark:text-primary-light">+{formatCurrency(item.price)}</span>}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Observations */}
            <section>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Observações</h3>
              <textarea
                placeholder="Alguma recomendação? Ex: Sem granola, caprichar no leite condensado..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] outline-none focus:border-primary font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none"
                rows={3}
              />
            </section>
          </div>
        </div>
      </div>

      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-xl border-t border-gray-100 dark:border-white/10 z-50">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 bg-gray-100 dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/10 w-full sm:w-auto justify-center">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-white/10 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="font-black text-xl w-8 text-center text-gray-900 dark:text-white">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-white/10 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            className="w-full sm:flex-1 py-4 md:py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between px-6 md:px-8"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              <span className="font-black text-base md:text-lg">Adicionar</span>
            </div>
            <span className="font-black text-lg md:text-xl">{formatCurrency(calculateTotal())}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
