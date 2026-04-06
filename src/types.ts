export type ProductStatus = 'available' | 'unavailable';
export type StoreStatus = 'active' | 'suspended' | 'canceled' | 'onboarding';
export type OnboardingStatus = 'pending' | 'in_progress' | 'completed';
export type BillingStatus = 'trial' | 'trial_expired' | 'active' | 'overdue' | 'suspended' | 'canceled';
export type StoreSegment = 'açaiteria' | 'restaurante' | 'pizzaria' | 'pastelaria' | 'hamburgueria' | 'lanchonete' | 'doceria' | 'marmitaria';
export type UserRole = 'SUPER_ADMIN' | 'STORE_ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string; // Only for STORE_ADMIN
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  segment: StoreSegment;
  logo: string;
  banner: string;
  primaryColor: string;
  secondaryColor: string;
  whatsapp: string;
  phone?: string;
  address: string;
  minOrderValue: number;
  deliveryFee: number;
  deliveryTime: string;
  isOpen: boolean;
  status: StoreStatus;
  subscriptionStatus?: BillingStatus; // Requested as subscriptionStatus
  openingHours: {
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }[];
  createdAt: string;
  
  // SaaS Fields
  planId: string;
  subscriptionId?: string;
  onboardingStatus: OnboardingStatus;
  billingStatus: BillingStatus;
  monthlyFee: number;
  setupFee: number;
  dueDate?: string;
  startDate: string;
  nextBillingDate?: string;
  expiresAt?: string; // Alias for nextBillingDate used in some UI components
  trialEndsAt?: string;
  suspendedAt?: string;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  icon?: string;
  order: number;
  active: boolean;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
}

export interface AddonItem {
  id: string;
  name: string;
  price: number;
}

export interface AddonGroup {
  id: string;
  name: string;
  minChoices: number;
  maxChoices: number;
  items: AddonItem[];
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number; // Base price or starting price
  image: string;
  status: ProductStatus;
  featured: boolean;
  isBestSeller?: boolean;
  isPromo?: boolean;
  variations?: ProductVariation[]; // e.g. Sizes
  addonGroups?: AddonGroup[];
}

export interface CartItem {
  id: string; // Unique ID for the cart entry (product + selections)
  productId: string;
  name: string;
  image: string;
  variation?: ProductVariation;
  addons: {
    groupId: string;
    groupName: string;
    items: AddonItem[];
  }[];
  quantity: number;
  price: number; // Price per unit with addons
  totalPrice: number; // price * quantity
  observations?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'ready' | 'completed' | 'cancelled';
export type DeliveryMethod = 'delivery' | 'pickup' | 'on_site';
export type PaymentMethod = 'money' | 'pix' | 'card_credit' | 'card_debit';

export interface Order {
  id: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    reference?: string;
  };
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  changeFor?: number;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  observations?: string;
}

export interface Neighborhood {
  id: string;
  storeId: string;
  name: string;
  deliveryFee: number;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  setupPrice: number;
  description: string;
  productLimit: number;
  bannerLimit: number;
  adminLimit: number;
  allowedSegments: string[] | 'all';
  features: string[];
  active: boolean;
}

export interface Subscription {
  id: string;
  storeId: string;
  planId: string;
  monthlyFee: number;
  setupFee: number;
  status: BillingStatus;
  setupStatus: OnboardingStatus;
  startDate: string;
  nextBillingDate: string;
  lastBillingDate?: string;
  notes?: string;
}

export interface OnboardingChecklist {
  id: string;
  storeId: string;
  status: OnboardingStatus;
  startDate: string;
  responsibleId?: string;
  items: {
    id: string;
    label: string;
    completed: boolean;
    updatedAt?: string;
  }[];
  notes?: string;
}

export interface BillingRecord {
  id: string;
  storeId: string;
  subscriptionId: string;
  amount: number;
  type: 'monthly' | 'setup';
  status: 'pending' | 'paid' | 'overdue' | 'canceled';
  dueDate: string;
  paidAt?: string;
}
