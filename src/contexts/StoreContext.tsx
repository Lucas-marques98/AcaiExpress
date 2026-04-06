import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { 
  Product, 
  Category, 
  Store, 
  Order, 
  Neighborhood, 
  AddonItem, 
  Plan,
  Subscription,
  OnboardingChecklist,
  BillingRecord
} from '../types';

interface StoreContextType {
  stores: Store[];
  plans: Plan[];
  subscriptions: Subscription[];
  onboardingChecklists: OnboardingChecklist[];
  billingRecords: BillingRecord[];
  currentStore: Store | null;
  products: Product[];
  categories: Category[];
  orders: Order[];
  neighborhoods: Neighborhood[];
  loading: boolean;
  
  // Selection
  setStoreBySlug: (slug: string) => Promise<void>;
  setStoreById: (id: string) => Promise<void>;
  
  // Store Actions (Super Admin)
  addStore: (store: Omit<Store, 'id' | 'createdAt'>) => Promise<string>;
  updateStore: (id: string, store: Partial<Store>) => Promise<void>;
  
  // Plan Actions (Super Admin)
  addPlan: (plan: Omit<Plan, 'id'>) => Promise<string>;
  updatePlan: (id: string, plan: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  
  // Subscription Actions
  updateSubscription: (id: string, subscription: Partial<Subscription>) => Promise<void>;

  // Onboarding Actions
  updateOnboarding: (id: string, onboarding: Partial<OnboardingChecklist>) => Promise<void>;
  toggleOnboardingItem: (storeId: string, itemId: string) => Promise<void>;

  // Product Actions (Store Admin)
  addProduct: (product: Omit<Product, 'id' | 'storeId'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Category Actions
  addCategory: (category: Omit<Category, 'id' | 'storeId'>) => Promise<string>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Order Actions
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'storeId'>) => Promise<string>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;

  // Neighborhood Actions
  addNeighborhood: (neighborhood: Omit<Neighborhood, 'id' | 'storeId'>) => Promise<string>;
  updateNeighborhood: (id: string, neighborhood: Partial<Neighborhood>) => Promise<void>;
  deleteNeighborhood: (id: string) => Promise<void>;

  // Store Config
  updateStoreConfig: (updatedFields: Partial<Store>) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [onboardingChecklists, setOnboardingChecklists] = useState<OnboardingChecklist[]>([]);
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Global Listeners (Public data)
  useEffect(() => {
    const unsubStores = onSnapshot(collection(db, 'stores'), (snapshot) => {
      setStores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Store)));
    });

    const unsubPlans = onSnapshot(collection(db, 'plans'), (snapshot) => {
      setPlans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan)));
      setLoading(false);
    });

    return () => {
      unsubStores();
      unsubPlans();
    };
  }, []);

  // Protected Listeners (SaaS data)
  useEffect(() => {
    if (!user) {
      setSubscriptions([]);
      setOnboardingChecklists([]);
      setBillingRecords([]);
      return;
    }

    let qSubs = query(collection(db, 'subscriptions'));
    let qOnboarding = query(collection(db, 'onboarding'));
    let qBilling = query(collection(db, 'billing'));

    if (user.role === 'STORE_ADMIN' && user.storeId) {
      qSubs = query(collection(db, 'subscriptions'), where('storeId', '==', user.storeId));
      qOnboarding = query(collection(db, 'onboarding'), where('storeId', '==', user.storeId));
      qBilling = query(collection(db, 'billing'), where('storeId', '==', user.storeId));
    } else if (user.role !== 'SUPER_ADMIN') {
      // If not super admin and no storeId, shouldn't see anything
      setSubscriptions([]);
      setOnboardingChecklists([]);
      setBillingRecords([]);
      return;
    }

    const unsubSubs = onSnapshot(qSubs, (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription)));
    });

    const unsubOnboarding = onSnapshot(qOnboarding, (snapshot) => {
      setOnboardingChecklists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OnboardingChecklist)));
    });

    const unsubBilling = onSnapshot(qBilling, (snapshot) => {
      setBillingRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BillingRecord)));
    });

    return () => {
      unsubSubs();
      unsubOnboarding();
      unsubBilling();
    };
  }, [user]);

  // Store Specific Listeners
  useEffect(() => {
    if (!currentStore) {
      setProducts([]);
      setCategories([]);
      setNeighborhoods([]);
      setOrders([]);
      return;
    }

    const unsubProducts = onSnapshot(
      query(collection(db, 'products'), where('storeId', '==', currentStore.id)),
      (snapshot) => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)))
    );

    const unsubCategories = onSnapshot(
      query(collection(db, 'categories'), where('storeId', '==', currentStore.id)),
      (snapshot) => setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)))
    );

    const unsubNeighborhoods = onSnapshot(
      query(collection(db, 'neighborhoods'), where('storeId', '==', currentStore.id)),
      (snapshot) => setNeighborhoods(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Neighborhood)))
    );

    const unsubOrders = onSnapshot(
      query(collection(db, 'orders'), where('storeId', '==', currentStore.id)),
      (snapshot) => setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)))
    );

    return () => {
      unsubProducts();
      unsubCategories();
      unsubNeighborhoods();
      unsubOrders();
    };
  }, [currentStore]);

  const setStoreBySlug = async (slug: string) => {
    const q = query(collection(db, 'stores'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      setCurrentStore({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Store);
    } else {
      setCurrentStore(null);
    }
  };

  const setStoreById = async (id: string) => {
    const docRef = doc(db, 'stores', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCurrentStore({ id: docSnap.id, ...docSnap.data() } as Store);
    } else {
      setCurrentStore(null);
    }
  };

  // Super Admin Actions
  const addStore = async (storeData: Omit<Store, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'stores'), {
      ...storeData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  };

  const updateStore = async (id: string, updatedFields: Partial<Store>) => {
    await updateDoc(doc(db, 'stores', id), updatedFields);
  };

  const addPlan = async (planData: Omit<Plan, 'id'>) => {
    const docRef = await addDoc(collection(db, 'plans'), planData);
    return docRef.id;
  };

  const updatePlan = async (id: string, updatedFields: Partial<Plan>) => {
    await updateDoc(doc(db, 'plans', id), updatedFields);
  };

  const deletePlan = async (id: string) => {
    await deleteDoc(doc(db, 'plans', id));
  };

  const updateSubscription = async (id: string, subscriptionData: Partial<Subscription>) => {
    await updateDoc(doc(db, 'subscriptions', id), subscriptionData);
  };

  const updateOnboarding = async (id: string, onboardingData: Partial<OnboardingChecklist>) => {
    await updateDoc(doc(db, 'onboarding', id), onboardingData);
  };

  const toggleOnboardingItem = async (storeId: string, itemId: string) => {
    const checklist = onboardingChecklists.find(o => o.storeId === storeId);
    if (!checklist) return;

    const updatedItems = checklist.items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() } : item
    );

    await updateDoc(doc(db, 'onboarding', checklist.id), { items: updatedItems });
  };

  // Store Admin Actions
  const addProduct = async (product: Omit<Product, 'id' | 'storeId'>) => {
    if (!currentStore) throw new Error('No store selected');
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      storeId: currentStore.id
    });
    return docRef.id;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    await updateDoc(doc(db, 'products', id), updatedFields);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const addCategory = async (category: Omit<Category, 'id' | 'storeId'>) => {
    if (!currentStore) throw new Error('No store selected');
    const docRef = await addDoc(collection(db, 'categories'), {
      ...category,
      storeId: currentStore.id
    });
    return docRef.id;
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>) => {
    await updateDoc(doc(db, 'categories', id), updatedFields);
  };

  const deleteCategory = async (id: string) => {
    await deleteDoc(doc(db, 'categories', id));
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'storeId'>) => {
    if (!currentStore) throw new Error('No store selected');
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      storeId: currentStore.id,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    return docRef.id;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  const updateStoreConfig = async (updatedFields: Partial<Store>) => {
    if (!currentStore) return;
    await updateDoc(doc(db, 'stores', currentStore.id), updatedFields);
  };

  const addNeighborhood = async (neighborhood: Omit<Neighborhood, 'id' | 'storeId'>) => {
    if (!currentStore) throw new Error('No store selected');
    const docRef = await addDoc(collection(db, 'neighborhoods'), {
      ...neighborhood,
      storeId: currentStore.id
    });
    return docRef.id;
  };

  const updateNeighborhood = async (id: string, updatedFields: Partial<Neighborhood>) => {
    await updateDoc(doc(db, 'neighborhoods', id), updatedFields);
  };

  const deleteNeighborhood = async (id: string) => {
    await deleteDoc(doc(db, 'neighborhoods', id));
  };

  return (
    <StoreContext.Provider value={{
      stores,
      plans,
      subscriptions,
      onboardingChecklists,
      billingRecords,
      currentStore,
      products,
      categories,
      orders,
      neighborhoods,
      loading,
      setStoreBySlug,
      setStoreById,
      addStore,
      updateStore,
      updateStoreConfig,
      addPlan,
      updatePlan,
      deletePlan,
      updateSubscription,
      updateOnboarding,
      toggleOnboardingItem,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addOrder,
      updateOrderStatus,
      addNeighborhood,
      updateNeighborhood,
      deleteNeighborhood
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
