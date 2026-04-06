import { Category, Product, Store, Neighborhood, User, Order, Plan, Subscription, OnboardingChecklist, BillingRecord } from './types';

export const users: User[] = [
  {
    id: 'u1',
    name: 'Lucas Rodrigues',
    email: 'lucas.rodrigues.caslu@gmail.com',
    role: 'SUPER_ADMIN',
    status: 'active',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'u2',
    name: 'Admin Açaí',
    email: 'acai@admin.com',
    role: 'STORE_ADMIN',
    storeId: 's1',
    status: 'active',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'u3',
    name: 'Admin Pizza',
    email: 'pizza@admin.com',
    role: 'STORE_ADMIN',
    storeId: 's2',
    status: 'active',
    createdAt: '2024-01-01T10:00:00Z'
  }
];

export const plans: Plan[] = [
  {
    id: 'p1',
    name: 'Básico',
    monthlyPrice: 49.90,
    setupPrice: 199.00,
    description: 'Ideal para quem está começando.',
    productLimit: 50,
    bannerLimit: 2,
    adminLimit: 1,
    allowedSegments: 'all',
    features: ['Até 50 produtos', 'Suporte via email', 'Relatórios básicos'],
    active: true
  },
  {
    id: 'p2',
    name: 'Profissional',
    monthlyPrice: 99.90,
    setupPrice: 299.00,
    description: 'Para negócios em crescimento.',
    productLimit: 200,
    bannerLimit: 5,
    adminLimit: 3,
    allowedSegments: 'all',
    features: ['Produtos ilimitados', 'Suporte via WhatsApp', 'Relatórios avançados', 'Cupons de desconto'],
    active: true
  },
  {
    id: 'p3',
    name: 'Premium',
    monthlyPrice: 199.90,
    setupPrice: 499.00,
    description: 'A experiência completa do MenuFlex.',
    productLimit: 1000,
    bannerLimit: 10,
    adminLimit: 10,
    allowedSegments: 'all',
    features: ['Tudo do Profissional', 'Gestão de entregadores', 'Fidelidade', 'Domínio próprio'],
    active: true
  }
];

export const stores: Store[] = [
  {
    id: 's1',
    name: 'Açaí Express Pro',
    slug: 'acai-express',
    segment: 'açaiteria',
    logo: 'https://cdn-icons-png.flaticon.com/512/2362/2362331.png',
    banner: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=1920&auto=format&fit=crop',
    primaryColor: '#6b21a8',
    secondaryColor: '#a855f7',
    whatsapp: '5511999999999',
    address: 'Av. Dr. José Maciel, 123 - Taboão da Serra, SP',
    minOrderValue: 15.00,
    deliveryFee: 5.00,
    deliveryTime: '30-45 min',
    isOpen: true,
    status: 'active',
    createdAt: '2024-01-01T10:00:00Z',
    planId: 'p2',
    subscriptionId: 'sub1',
    onboardingStatus: 'completed',
    billingStatus: 'active',
    monthlyFee: 99.90,
    setupFee: 299.00,
    startDate: '2024-01-01T10:00:00Z',
    nextBillingDate: '2026-05-01T10:00:00Z',
    openingHours: [
      { day: 'Segunda', open: '14:00', close: '22:00', closed: false },
      { day: 'Terça', open: '14:00', close: '22:00', closed: false },
      { day: 'Quarta', open: '14:00', close: '22:00', closed: false },
      { day: 'Quinta', open: '14:00', close: '22:00', closed: false },
      { day: 'Sexta', open: '14:00', close: '23:00', closed: false },
      { day: 'Sábado', open: '12:00', close: '23:00', closed: false },
      { day: 'Domingo', open: '12:00', close: '22:00', closed: false },
    ]
  },
  {
    id: 's2',
    name: 'Bella Pizza Gourmet',
    slug: 'bella-pizza',
    segment: 'pizzaria',
    logo: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png',
    banner: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1920&auto=format&fit=crop',
    primaryColor: '#e11d48',
    secondaryColor: '#fb7185',
    whatsapp: '5511888888888',
    address: 'Rua das Pizzas, 456 - São Paulo, SP',
    minOrderValue: 35.00,
    deliveryFee: 7.00,
    deliveryTime: '40-55 min',
    isOpen: true,
    status: 'active',
    createdAt: '2024-02-15T10:00:00Z',
    planId: 'p1',
    subscriptionId: 'sub2',
    onboardingStatus: 'completed',
    billingStatus: 'active',
    monthlyFee: 49.90,
    setupFee: 199.00,
    startDate: '2024-02-15T10:00:00Z',
    nextBillingDate: '2026-05-15T10:00:00Z',
    openingHours: [
      { day: 'Segunda', open: '18:00', close: '23:00', closed: false },
      { day: 'Terça', open: '18:00', close: '23:00', closed: false },
      { day: 'Quarta', open: '18:00', close: '23:00', closed: false },
      { day: 'Quinta', open: '18:00', close: '23:00', closed: false },
      { day: 'Sexta', open: '18:00', close: '00:00', closed: false },
      { day: 'Sábado', open: '18:00', close: '00:00', closed: false },
      { day: 'Domingo', open: '18:00', close: '23:00', closed: false },
    ]
  },
  {
    id: 's3',
    name: 'Burger King do Bairro',
    slug: 'burger-king-bairro',
    segment: 'hamburgueria',
    logo: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
    banner: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1920&auto=format&fit=crop',
    primaryColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    whatsapp: '5511777777777',
    address: 'Rua dos Burgers, 789 - São Paulo, SP',
    minOrderValue: 20.00,
    deliveryFee: 6.00,
    deliveryTime: '25-40 min',
    isOpen: false,
    status: 'onboarding',
    createdAt: '2026-04-01T10:00:00Z',
    planId: 'p2',
    subscriptionId: 'sub3',
    onboardingStatus: 'in_progress',
    billingStatus: 'trial',
    monthlyFee: 99.90,
    setupFee: 299.00,
    startDate: '2026-04-01T10:00:00Z',
    nextBillingDate: '2026-05-01T10:00:00Z',
    openingHours: [
      { day: 'Segunda', open: '11:00', close: '23:00', closed: false },
      { day: 'Terça', open: '11:00', close: '23:00', closed: false },
      { day: 'Quarta', open: '11:00', close: '23:00', closed: false },
      { day: 'Quinta', open: '11:00', close: '23:00', closed: false },
      { day: 'Sexta', open: '11:00', close: '00:00', closed: false },
      { day: 'Sábado', open: '11:00', close: '00:00', closed: false },
      { day: 'Domingo', open: '11:00', close: '23:00', closed: false },
    ]
  },
  {
    id: 's4',
    name: 'Sushi Master',
    slug: 'sushi-master',
    segment: 'restaurante',
    logo: 'https://cdn-icons-png.flaticon.com/512/2252/2252439.png',
    banner: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1920&auto=format&fit=crop',
    primaryColor: '#000000',
    secondaryColor: '#333333',
    whatsapp: '5511666666666',
    address: 'Av. do Sushi, 101 - São Paulo, SP',
    minOrderValue: 50.00,
    deliveryFee: 10.00,
    deliveryTime: '50-70 min',
    isOpen: true,
    status: 'suspended',
    createdAt: '2025-10-10T10:00:00Z',
    planId: 'p3',
    subscriptionId: 'sub4',
    onboardingStatus: 'completed',
    billingStatus: 'overdue',
    monthlyFee: 199.90,
    setupFee: 499.00,
    startDate: '2025-10-10T10:00:00Z',
    nextBillingDate: '2026-04-10T10:00:00Z',
    suspendedAt: '2026-04-15T10:00:00Z',
    openingHours: [
      { day: 'Segunda', open: '18:00', close: '23:00', closed: false },
      { day: 'Terça', open: '18:00', close: '23:00', closed: false },
      { day: 'Quarta', open: '18:00', close: '23:00', closed: false },
      { day: 'Quinta', open: '18:00', close: '23:00', closed: false },
      { day: 'Sexta', open: '18:00', close: '00:00', closed: false },
      { day: 'Sábado', open: '18:00', close: '00:00', closed: false },
      { day: 'Domingo', open: '18:00', close: '23:00', closed: false },
    ]
  }
];

export const subscriptions: Subscription[] = [
  {
    id: 'sub1',
    storeId: 's1',
    planId: 'p2',
    monthlyFee: 99.90,
    setupFee: 299.00,
    status: 'active',
    setupStatus: 'completed',
    startDate: '2024-01-01T10:00:00Z',
    nextBillingDate: '2026-05-01T10:00:00Z'
  },
  {
    id: 'sub2',
    storeId: 's2',
    planId: 'p1',
    monthlyFee: 49.90,
    setupFee: 199.00,
    status: 'active',
    setupStatus: 'completed',
    startDate: '2024-02-15T10:00:00Z',
    nextBillingDate: '2026-05-15T10:00:00Z'
  },
  {
    id: 'sub3',
    storeId: 's3',
    planId: 'p2',
    monthlyFee: 99.90,
    setupFee: 299.00,
    status: 'trial',
    setupStatus: 'in_progress',
    startDate: '2026-04-01T10:00:00Z',
    nextBillingDate: '2026-05-01T10:00:00Z'
  },
  {
    id: 'sub4',
    storeId: 's4',
    planId: 'p3',
    monthlyFee: 199.90,
    setupFee: 499.00,
    status: 'overdue',
    setupStatus: 'completed',
    startDate: '2025-10-10T10:00:00Z',
    nextBillingDate: '2026-04-10T10:00:00Z'
  }
];

export const onboardingChecklists: OnboardingChecklist[] = [
  {
    id: 'ob1',
    storeId: 's3',
    status: 'in_progress',
    startDate: '2026-04-01T10:00:00Z',
    items: [
      { id: '1', label: 'Logo enviada', completed: true },
      { id: '2', label: 'Banners configurados', completed: true },
      { id: '3', label: 'Categorias criadas', completed: true },
      { id: '4', label: 'Produtos cadastrados', completed: false },
      { id: '5', label: 'Cores ajustadas', completed: false },
      { id: '6', label: 'WhatsApp configurado', completed: false },
      { id: '7', label: 'Loja publicada', completed: false },
    ]
  }
];

export const billingRecords: BillingRecord[] = [
  {
    id: 'br1',
    storeId: 's1',
    subscriptionId: 'sub1',
    amount: 99.90,
    type: 'monthly',
    status: 'paid',
    dueDate: '2026-04-01T10:00:00Z',
    paidAt: '2026-03-30T10:00:00Z'
  },
  {
    id: 'br2',
    storeId: 's4',
    subscriptionId: 'sub4',
    amount: 199.90,
    type: 'monthly',
    status: 'overdue',
    dueDate: '2026-04-10T10:00:00Z'
  }
];

export const neighborhoods: Neighborhood[] = [
  { id: 'n1', storeId: 's1', name: 'Centro', deliveryFee: 5.00 },
  { id: 'n2', storeId: 's1', name: 'Parque Pinheiros', deliveryFee: 7.00 },
  { id: 'n11', storeId: 's2', name: 'Vila Mariana', deliveryFee: 8.00 },
  { id: 'n12', storeId: 's2', name: 'Moema', deliveryFee: 12.00 },
];

export const categories: Category[] = [
  { id: '1', storeId: 's1', name: 'Açaís Tradicionais', slug: 'acais-tradicionais', order: 1, active: true, icon: 'IceCream' },
  { id: '2', storeId: 's1', name: 'Monte seu Açaí', slug: 'monte-seu-acai', order: 2, active: true, icon: 'PlusCircle' },
  { id: 'c1', storeId: 's2', name: 'Pizzas Salgadas', slug: 'pizzas-salgadas', order: 1, active: true, icon: 'Pizza' },
  { id: 'c2', storeId: 's2', name: 'Pizzas Doces', slug: 'pizzas-doces', order: 2, active: true, icon: 'Cookie' },
];

export const products: Product[] = [
  {
    id: 'p1',
    storeId: 's1',
    categoryId: '1',
    name: 'Açaí Tradicional Premium',
    description: 'Nosso açaí puro, cremoso e batido na hora. Textura aveludada incomparável.',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop',
    status: 'available',
    featured: true,
    isBestSeller: true,
    variations: [
      { id: 'v1', name: 'Copo 300ml', price: 14.90 },
      { id: 'v2', name: 'Copo 500ml', price: 18.90 },
    ]
  },
  {
    id: 'p_pizza1',
    storeId: 's2',
    categoryId: 'c1',
    name: 'Pizza Margherita',
    description: 'Molho de tomate pelati, mozzarella de búfala, manjericão fresco e azeite extra virgem.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=800&auto=format&fit=crop',
    status: 'available',
    featured: true,
    isBestSeller: true,
    variations: [
      { id: 'v_p1', name: 'Média (6 fatias)', price: 45.00 },
      { id: 'v_p2', name: 'Grande (8 fatias)', price: 58.00 },
    ]
  }
];

export const orders: Order[] = [
  {
    id: 'o1',
    storeId: 's1',
    customerName: 'João Silva',
    customerPhone: '11988887777',
    deliveryMethod: 'delivery',
    paymentMethod: 'pix',
    items: [],
    subtotal: 18.90,
    deliveryFee: 5.00,
    total: 23.90,
    status: 'completed',
    createdAt: new Date().toISOString(),
  }
];

