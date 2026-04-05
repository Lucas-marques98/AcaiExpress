import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, StoreConfig, Order, Neighborhood, AddonItem } from '../types';
import { products as initialProducts, categories as initialCategories, storeConfig as initialStoreConfig, neighborhoods as initialNeighborhoods } from '../mockData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  storeConfig: StoreConfig;
  orders: Order[];
  neighborhoods: Neighborhood[];
  
  // Product Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Category Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Order Actions
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
  // Store Config Actions
  updateStoreConfig: (config: Partial<StoreConfig>) => void;
  updateOpeningHours: (hours: StoreConfig['openingHours']) => void;
  
  // Banner Actions
  updateBanner: (url: string) => void;
  
  // Addon Actions
  addons: AddonItem[];
  addAddon: (addon: Omit<AddonItem, 'id'>) => void;
  updateAddon: (id: string, addon: Partial<AddonItem>) => void;
  deleteAddon: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(initialStoreConfig);
  const [neighborhoods] = useState<Neighborhood[]>(initialNeighborhoods);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addons, setAddons] = useState<AddonItem[]>([
    { id: 'a1', name: 'Granola', price: 2.5 },
    { id: 'a2', name: 'Leite Condensado', price: 3.0 },
    { id: 'a3', name: 'Morango', price: 4.5 },
    { id: 'a4', name: 'Banana', price: 2.0 },
    { id: 'a5', name: 'Leite em Pó', price: 3.5 },
    { id: 'a6', name: 'Mel', price: 1.5 },
  ]);

  // Product Actions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Category Actions
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Math.random().toString(36).substr(2, 9) };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Order Actions
  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  // Store Config Actions
  const updateStoreConfig = (config: Partial<StoreConfig>) => {
    setStoreConfig(prev => ({ ...prev, ...config }));
  };

  const updateOpeningHours = (hours: StoreConfig['openingHours']) => {
    setStoreConfig(prev => ({ ...prev, openingHours: hours }));
  };

  const updateBanner = (url: string) => {
    setStoreConfig(prev => ({ ...prev, banner: url }));
  };

  // Addon Actions
  const addAddon = (addon: Omit<AddonItem, 'id'>) => {
    const newAddon = { ...addon, id: Math.random().toString(36).substr(2, 9) };
    setAddons(prev => [...prev, newAddon]);
  };

  const updateAddon = (id: string, updatedFields: Partial<AddonItem>) => {
    setAddons(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
  };

  const deleteAddon = (id: string) => {
    setAddons(prev => prev.filter(a => a.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      storeConfig,
      orders,
      neighborhoods,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addOrder,
      updateOrderStatus,
      updateStoreConfig,
      updateOpeningHours,
      updateBanner,
      addons,
      addAddon,
      updateAddon,
      deleteAddon
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
