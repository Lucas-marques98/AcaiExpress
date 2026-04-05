import React, { useState } from 'react';
import { Product, ProductVariation, AddonItem } from '../types';
import { Modal } from './Modal';
import { Button } from './Button';
import { formatCurrency, cn } from '../lib/utils';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product?.variations?.[0]
  );
  const [selectedAddons, setSelectedAddons] = useState<{ groupId: string; groupName: string; items: AddonItem[] }[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');

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
    addToCart(product, selectedVariation, selectedAddons, observations, quantity);
    onClose();
    // Reset state
    setQuantity(1);
    setObservations('');
    setSelectedAddons([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="space-y-8">
        <div className="relative aspect-video rounded-2xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <p className="text-gray-600 leading-relaxed">{product.description}</p>

        {/* Variations (Sizes) */}
        {product.variations && product.variations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-bold flex items-center gap-2">
              Escolha o tamanho <span className="text-xs font-normal text-gray-400">(Obrigatório)</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {product.variations.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariation(v)}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all",
                    selectedVariation?.id === v.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <p className="font-bold">{v.name}</p>
                  <p className="text-sm text-primary font-semibold">{formatCurrency(v.price)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Addon Groups */}
        {product.addonGroups?.map(group => (
          <div key={group.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">{group.name}</h4>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-500">
                {group.maxChoices === 1 ? 'Escolha 1' : `Até ${group.maxChoices}`}
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
                      "w-full p-4 rounded-2xl border flex items-center justify-between transition-all",
                      isSelected ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-all",
                        isSelected ? "bg-primary border-primary" : "border-gray-300"
                      )}>
                        {isSelected && <Plus className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.price > 0 && (
                      <span className="text-sm font-bold text-primary">+{formatCurrency(item.price)}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Observations */}
        <div className="space-y-3">
          <h4 className="font-bold">Observações</h4>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Ex: Sem granola, caprichar no leite condensado..."
            className="w-full p-4 rounded-2xl border border-gray-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24"
          />
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white pt-4 pb-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-50"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-bold text-lg w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-black text-primary">{formatCurrency(calculateCurrentPrice())}</p>
            </div>
          </div>
          <Button onClick={handleAddToCart} className="w-full py-6 text-lg rounded-3xl">
            <ShoppingBag className="w-6 h-6 mr-2" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </Modal>
  );
};
