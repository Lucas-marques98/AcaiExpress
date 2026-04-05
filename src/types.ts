export type ProductStatus = 'available' | 'unavailable';

export interface Category {
  id: string;
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

export interface AddonItem {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
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
  name: string;
  deliveryFee: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  deliveryFee: number;
}

export interface StoreConfig {
  name: string;
  logo: string;
  banner: string;
  primaryColor: string;
  secondaryColor: string;
  whatsapp: string;
  address: string;
  minOrderValue: number;
  deliveryTime: string;
  isOpen: boolean;
  openingHours: {
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }[];
}
