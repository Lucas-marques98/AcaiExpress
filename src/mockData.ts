import { Category, Product, StoreConfig, Neighborhood } from './types';

export const neighborhoods: Neighborhood[] = [
  { id: 'n1', name: 'Centro', deliveryFee: 5.00 },
  { id: 'n2', name: 'Parque Pinheiros', deliveryFee: 7.00 },
  { id: 'n3', name: 'Jardim Maria Rosa', deliveryFee: 6.00 },
  { id: 'n4', name: 'Jardim América', deliveryFee: 8.00 },
  { id: 'n5', name: 'Jardim Helena', deliveryFee: 7.50 },
  { id: 'n6', name: 'Pirajuçara', deliveryFee: 9.00 },
  { id: 'n7', name: 'Jardim Record', deliveryFee: 8.50 },
  { id: 'n8', name: 'Jardim Leme', deliveryFee: 10.00 },
  { id: 'n9', name: 'Intercap', deliveryFee: 6.50 },
  { id: 'n10', name: 'Jardim Mituzi', deliveryFee: 9.50 },
];

export const categories: Category[] = [
  { id: '1', name: 'Açaís Tradicionais', slug: 'acais-tradicionais', order: 1, active: true, icon: 'IceCream' },
  { id: '2', name: 'Monte seu Açaí', slug: 'monte-seu-acai', order: 2, active: true, icon: 'PlusCircle' },
  { id: '3', name: 'Copos e Tigelas', slug: 'copos-e-tigelas', order: 3, active: true, icon: 'CupSoda' },
  { id: '4', name: 'Combos Promocionais', slug: 'combos', order: 4, active: true, icon: 'Tag' },
  { id: '5', name: 'Milk-shakes', slug: 'milk-shakes', order: 5, active: true, icon: 'GlassWater' },
  { id: '6', name: 'Bebidas', slug: 'bebidas', order: 6, active: true, icon: 'Beer' },
];

export const products: Product[] = [
  {
    id: 'p1',
    categoryId: '1',
    name: 'Açaí Tradicional Premium',
    description: 'Nosso açaí puro, cremoso e batido na hora. Textura aveludada incomparável. Acompanha granola artesanal e leite em pó.',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop',
    status: 'available',
    featured: true,
    isBestSeller: true,
    variations: [
      { id: 'v1', name: 'Copo 300ml', price: 14.90 },
      { id: 'v2', name: 'Copo 500ml', price: 18.90 },
      { id: 'v3', name: 'Copo 700ml', price: 24.90 },
    ],
    addonGroups: [
      {
        id: 'g1',
        name: 'Escolha suas frutas (até 2)',
        minChoices: 0,
        maxChoices: 2,
        items: [
          { id: 'a1', name: 'Banana Fatiada', price: 0 },
          { id: 'a2', name: 'Morango Fresco', price: 2.50 },
          { id: 'a3', name: 'Manga Palmer', price: 0 },
          { id: 'a4', name: 'Kiwi', price: 3.00 },
        ]
      },
      {
        id: 'g2',
        name: 'Complementos Grátis',
        minChoices: 0,
        maxChoices: 3,
        items: [
          { id: 'a5', name: 'Granola Artesanal', price: 0 },
          { id: 'a6', name: 'Leite em Pó Ninho', price: 0 },
          { id: 'a7', name: 'Paçoca Rolha', price: 0 },
          { id: 'a8', name: 'Amendoim Triturado', price: 0 },
        ]
      },
      {
        id: 'g3',
        name: 'Cremes Extras Premium',
        minChoices: 0,
        maxChoices: 2,
        items: [
          { id: 'a9', name: 'Leite Moça', price: 2.00 },
          { id: 'a10', name: 'Mel Orgânico', price: 1.50 },
          { id: 'a11', name: 'Creme de Avelã (Nutella)', price: 5.00 },
          { id: 'a12', name: 'Creme de Ninho Trufado', price: 4.50 },
        ]
      }
    ]
  },
  {
    id: 'p2',
    categoryId: '2',
    name: 'Monte seu Açaí do Zero',
    description: 'A experiência definitiva. Escolha o tamanho, a base, os cremes e as frutas. Faça do seu jeito!',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=800&auto=format&fit=crop',
    status: 'available',
    featured: true,
    isBestSeller: true,
    variations: [
      { id: 'v4', name: 'Copo 300ml', price: 15.00 },
      { id: 'v5', name: 'Copo 500ml', price: 22.00 },
      { id: 'v6', name: 'Tigela 700ml', price: 28.00 },
      { id: 'v7', name: 'Barca Família 1L', price: 45.00 },
    ],
    addonGroups: [
      {
        id: 'g4',
        name: 'Cremes Especiais (Escolha 1)',
        minChoices: 1,
        maxChoices: 1,
        items: [
          { id: 'a13', name: 'Creme de Ninho', price: 0 },
          { id: 'a14', name: 'Creme de Morango', price: 0 },
          { id: 'a15', name: 'Creme de Cupuaçu', price: 0 },
          { id: 'a16', name: 'Creme de Pistache', price: 4.00 },
        ]
      },
      {
        id: 'g5',
        name: 'Frutas Frescas (Escolha até 3)',
        minChoices: 0,
        maxChoices: 3,
        items: [
          { id: 'a17', name: 'Banana', price: 0 },
          { id: 'a18', name: 'Morango', price: 0 },
          { id: 'a19', name: 'Kiwi', price: 0 },
          { id: 'a20', name: 'Uva Verde', price: 0 },
        ]
      }
    ]
  },
  {
    id: 'p3',
    categoryId: '4',
    name: 'Combo Casal Apaixonado',
    description: '2 Açaís de 500ml com 3 complementos cada + 1 adicional de Nutella grátis. Perfeito para dividir!',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop',
    status: 'available',
    featured: true,
    isPromo: true,
  },
  {
    id: 'p4',
    categoryId: '5',
    name: 'Milk-shake Trufado de Açaí',
    description: 'Super cremoso, batido com leite integral, sorvete de baunilha e borda recheada de Nutella.',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bee?q=80&w=800&auto=format&fit=crop',
    status: 'available',
    featured: false,
    isBestSeller: true,
  },
  {
    id: 'p6',
    categoryId: '3',
    name: 'Tigela Vulcão de Ninho',
    description: 'Açaí na tigela com uma borda vulcânica de creme de ninho e morangos frescos.',
    price: 29.90,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop',
    status: 'available',
    featured: true,
    isPromo: true,
  },
  {
    id: 'p5',
    categoryId: '6',
    name: 'Água Mineral 500ml',
    description: 'Com ou sem gás, bem gelada.',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=800&auto=format&fit=crop',
    status: 'available',
    featured: false,
  }
];

export const storeConfig: StoreConfig = {
  name: 'Açaí Express Pro',
  logo: 'https://cdn-icons-png.flaticon.com/512/2362/2362331.png',
  banner: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=1920&auto=format&fit=crop',
  primaryColor: '#6b21a8', // purple-800
  secondaryColor: '#a855f7', // purple-500
  whatsapp: '5511999999999',
  address: 'Av. Dr. José Maciel, 123 - Taboão da Serra, SP',
  minOrderValue: 15.00,
  deliveryTime: '30-45 min',
  isOpen: true,
  openingHours: [
    { day: 'Segunda', open: '14:00', close: '22:00', closed: false },
    { day: 'Terça', open: '14:00', close: '22:00', closed: false },
    { day: 'Quarta', open: '14:00', close: '22:00', closed: false },
    { day: 'Quinta', open: '14:00', close: '22:00', closed: false },
    { day: 'Sexta', open: '14:00', close: '23:00', closed: false },
    { day: 'Sábado', open: '12:00', close: '23:00', closed: false },
    { day: 'Domingo', open: '12:00', close: '22:00', closed: false },
  ]
};

