import React, { useState, useEffect } from 'react';
import { Product, ProductVariation, AddonItem, CartItem } from '../types';
import { Modal } from './Modal';
import { Button } from './Button';
import { formatCurrency, cn } from '../lib/utils';
import { Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  initialCartItem?: CartItem | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, initialCartItem }) => {
  const { addToCart, updateCartItem } = useCart();
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<{ groupId: string; groupName: string; items: AddonItem[] }[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');

  // Reset state when product or initialCartItem changes
  useEffect(() => {
    if (initialCartItem && product) {
      setSelectedVariation(initialCartItem.variation);
      setSelectedAddons(initialCartItem.addons);
      setQuantity(initialCartItem.quantity);
      setObservations(initialCartItem.observations || '');
    } else if (product) {
      setSelectedVariation(product.variations?.[0]);
      setSelectedAddons([]);
      setQuantity(1);
      setObservations('');
    }
  }, [product, initialCartItem]);

  if (!product) return null;

  const handleAddonToggle = (groupId: string, groupName: string, item: AddonItem, maxChoices: number) => {
    setSelectedAddons(prev => {
      const group = prev.find(g => g.groupId === groupId);
      
      if (!group) {
        return [...prev, { groupId, groupName, items: [item] }];
      }

      const isSelected = group.items.some(i => i.id === item.id);
      
      if (isSelected) {
        const newItems = group.items.filter(i => i.id !== item.id);
        if (newItems.length === 0) {
          return prev.filter(g => g.groupId !== groupId);
        }
        return prev.map(g => g.groupId === groupId ? { ...g, items: newItems } : g);
      }

      if (group.items.length < maxChoices) {
        return prev.map(g => g.groupId === groupId ? { ...g, items: [...g.items, item] } : g);
      }

      if (maxChoices === 1) {
        return prev.map(g => g.groupId === groupId ? { ...g, items: [item] } : g);
      }

      return prev;
    });
  };

  const calculateCurrentPrice = () => {
    const basePrice = selectedVariation ? selectedVariation.price : product.price;
    const addonsPrice = selectedAddons.reduce((acc, group) => 
      acc + group.items.reduce((groupAcc, item) => groupAcc + item.price, 0), 0
    );
    return (basePrice + addonsPrice) * quantity;
  };

  const handleAddToCart = () => {
    // Validate minChoices for each addon group
    if (product.addonGroups) {
      for (const group of product.addonGroups) {
        const selectedGroup = selectedAddons.find(g => g.groupId === group.id);
        const selectedCount = selectedGroup?.items.length || 0;
        if (group.minChoices && selectedCount < group.minChoices) {
          toast.info(`Por favor, selecione pelo menos ${group.minChoices} opções para ${group.name}`);
          return;
        }
      }
    }

    if (initialCartItem) {
      updateCartItem(initialCartItem.id, product, selectedVariation, selectedAddons, observations, quantity);
    } else {
      addToCart(product, selectedVariation, selectedAddons, observations, quantity);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialCartItem ? 'Editar Item' : product.name} className="p-0 sm:p-0">
      <div className="space-y-8 pb-32">
        <div className="relative aspect-[4/3] sm:aspect-video -mx-6 -mt-6 mb-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-black mb-1 drop-shadow-lg">{product.name}</h2>
            <p className="text-white text-sm line-clamp-2 font-bold drop-shadow-md">{product.description}</p>
          </div>
        </div>

        {/* Variations (Sizes) */}
        {product.variations && product.variations.length > 0 && (
          <div className="space-y-4 px-6">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-lg text-gray-900 dark:text-white">Escolha o tamanho</h4>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-lg">Obrigatório</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {product.variations.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariation(v)}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden",
                    selectedVariation?.id === v.id
                      ? "border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary"
                      : "border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20 bg-white dark:bg-white/5"
                  )}
                >
                  {selectedVariation?.id === v.id && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <p className={cn("font-black mb-1", selectedVariation?.id === v.id ? "text-primary" : "text-gray-900 dark:text-white")}>{v.name}</p>
                  <p className={cn("text-sm font-black", selectedVariation?.id === v.id ? "text-primary/80" : "text-gray-700 dark:text-gray-200")}>{formatCurrency(v.price)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Addon Groups */}
        {product.addonGroups?.map(group => (
          <div key={group.id} className="space-y-4 px-6">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10">
              <div>
                <h4 className="font-black text-lg text-gray-900 dark:text-white">{group.name}</h4>
                <p className="text-xs font-black text-gray-700 dark:text-gray-200">
                  {group.maxChoices === 1 ? 'Escolha 1 opção' : `Escolha até ${group.maxChoices} opções`}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm">
                {group.minChoices > 0 ? 'Obrigatório' : 'Opcional'}
              </span>
            </div>
            <div className="space-y-2">
              {group.items.map(item => {
                const isSelected = selectedAddons.find(g => g.groupId === group.id)?.items.some(i => i.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAddonToggle(group.id, group.name, item, group.maxChoices)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                      isSelected ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20 bg-white dark:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        isSelected ? "bg-primary border-primary" : "border-gray-300 dark:border-white/20"
                      )}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={cn("font-black", isSelected ? "text-primary" : "text-gray-700 dark:text-gray-200")}>{item.name}</span>
                    </div>
                    {item.price > 0 && (
                      <span className={cn("text-sm font-black", isSelected ? "text-primary" : "text-gray-700 dark:text-gray-200")}>+{formatCurrency(item.price)}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Observations */}
        <div className="space-y-4 px-6">
          <h4 className="font-black text-lg text-gray-900 dark:text-white">Alguma observação?</h4>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Ex: Sem granola, caprichar no leite condensado..."
            className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24 font-black text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 bg-gray-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10"
          />
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a1a1c]/95 backdrop-blur-md border-t border-gray-100 dark:border-white/10 p-4 sm:p-6 space-y-4 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-white/10">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-black text-lg w-6 text-center text-gray-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total</p>
              <p className="text-3xl font-black text-primary dark:text-primary-light">{formatCurrency(calculateCurrentPrice())}</p>
            </div>
          </div>
          <Button onClick={handleAddToCart} className="w-full py-6 text-lg rounded-3xl shadow-xl shadow-primary/20 font-black">
            <ShoppingBag className="w-6 h-6 mr-2" />
            {initialCartItem ? 'Atualizar Item' : 'Adicionar ao Carrinho'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


