import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariation, AddonItem } from '../types';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variation?: ProductVariation, addons?: { groupId: string; groupName: string; items: AddonItem[] }[], observations?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product,
    variation?: ProductVariation,
    addons: { groupId: string; groupName: string; items: AddonItem[] }[] = [],
    observations: string = '',
    quantity: number = 1
  ) => {
    const basePrice = variation ? variation.price : product.price;
    const addonsPrice = addons.reduce((acc, group) => 
      acc + group.items.reduce((groupAcc, item) => groupAcc + item.price, 0), 0
    );
    const unitPrice = basePrice + addonsPrice;
    
    const cartItemId = `${product.id}-${variation?.id || 'base'}-${addons.map(g => g.items.map(i => i.id).join(',')).join('|')}-${observations}`;

    setCart(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === cartItemId);
      
      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        newCart[existingItemIndex].totalPrice = newCart[existingItemIndex].quantity * unitPrice;
        return newCart;
      }

      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        image: product.image,
        variation,
        addons,
        quantity,
        price: unitPrice,
        totalPrice: unitPrice * quantity,
        observations
      };

      return [...prev, newItem];
    });

    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, totalPrice: newQty * item.price };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
