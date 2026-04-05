import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowUpRight,
  Image as ImageIcon,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Store,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, cn } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Product, Category, Order } from '../types';

type AdminTab = 'dashboard' | 'orders' | 'products' | 'categories' | 'adicionais' | 'banners' | 'horarios' | 'clientes' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { 
    products, categories, orders, storeConfig, 
    updateOrderStatus, deleteProduct, addProduct, updateProduct,
    deleteCategory, addCategory, updateCategory,
    updateStoreConfig, updateOpeningHours, updateBanner,
    addons, addAddon, updateAddon, deleteAddon
  } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<any | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form States
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({});
  const [addonForm, setAddonForm] = useState<any>({});

  // Temp States for Store Config
  const [tempHours, setTempHours] = useState(storeConfig.openingHours);
  const [tempBanner, setTempBanner] = useState(storeConfig.banner);
  const [tempSettings, setTempSettings] = useState(storeConfig);

  React.useEffect(() => {
    setTempHours(storeConfig.openingHours);
    setTempBanner(storeConfig.banner);
    setTempSettings(storeConfig);
  }, [storeConfig]);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      toast.success('Produto atualizado!');
    } else {
      addProduct(productForm as Omit<Product, 'id'>);
      toast.success('Produto adicionado!');
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({});
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
      toast.success('Categoria atualizada!');
    } else {
      addCategory(categoryForm as Omit<Category, 'id'>);
      toast.success('Categoria adicionada!');
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({});
  };

  const handleSaveAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddon) {
      updateAddon(editingAddon.id, addonForm);
      toast.success('Adicional atualizado!');
    } else {
      addAddon(addonForm);
      toast.success('Adicional adicionado!');
    }
    setIsAddonModalOpen(false);
    setEditingAddon(null);
    setAddonForm({});
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setIsProductModalOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm(category);
    setIsCategoryModalOpen(true);
  };

  const openEditAddon = (addon: any) => {
    setEditingAddon(addon);
    setAddonForm(addon);
    setIsAddonModalOpen(true);
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  // Metrics Calculations
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const averageTicket = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // Chart data (last 7 days)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      const revenue = dayOrders.reduce((acc, curr) => acc + curr.total, 0);
      return { name: dateStr, vendas: revenue };
    });

    return { totalRevenue, pendingOrders, completedOrders, averageTicket, chartData: last7Days };
  }, [orders]);

  const stats = [
    { label: 'Faturamento Total', value: formatCurrency(metrics.totalRevenue), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
    { label: 'Pedidos Pendentes', value: metrics.pendingOrders.toString(), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { label: 'Pedidos Concluídos', value: metrics.completedOrders.toString(), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Ticket Médio', value: formatCurrency(metrics.averageTicket), icon: ArrowUpRight, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] premium-shadow border border-gray-50 dark:border-white/10">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <p className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white dark:bg-white/5 rounded-[2.5rem] premium-shadow p-8 border border-gray-50 dark:border-white/10">
          <h3 className="text-xl font-black mb-6 text-gray-900 dark:text-white">Desempenho Semanal</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="dark:stroke-white/5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: '#1f2937', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                />
                <Line type="monotone" dataKey="vendas" stroke="#6b21a8" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white dark:bg-white/5 rounded-[2.5rem] premium-shadow overflow-hidden flex flex-col border border-gray-50 dark:border-white/10">
          <div className="p-8 border-b dark:border-white/10 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Pedidos Recentes</h3>
            <button onClick={() => setActiveTab('orders')} className="text-primary dark:text-primary-light font-black text-sm">Ver todos</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-primary/20 transition-colors flex items-center justify-between bg-white dark:bg-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-gray-900 dark:text-white">{order.id}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                      order.status === 'preparing' ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400" :
                      order.status === 'pending' ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" :
                      order.status === 'completed' ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400" :
                      "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary dark:text-primary-light">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <ShoppingBag className="w-12 h-12 text-gray-200 dark:text-gray-800 mb-2" />
                <p className="text-gray-400 dark:text-gray-500 font-black text-sm">Nenhum pedido ainda</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Gestão de Pedidos</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
            <input type="text" placeholder="Buscar pedido..." className="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all font-black text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
          </div>
          <Button 
            onClick={() => toast.info('Filtros avançados em breve!')}
            variant="outline" 
            size="sm" 
            className="rounded-xl font-black border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-200"
          >
            <Filter className="w-4 h-4 mr-2" /> Filtros
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-[2rem] premium-shadow overflow-hidden border border-gray-50 dark:border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pedido</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cliente</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/10">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-black text-gray-900 dark:text-white">{order.id}</td>
                <td className="px-6 py-4">
                  <p className="font-black text-gray-900 dark:text-white">{order.customerName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{order.customerPhone}</p>
                </td>
                <td className="px-6 py-4 font-black text-primary dark:text-primary-light">{formatCurrency(order.total)}</td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer",
                      order.status === 'preparing' ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400" :
                      order.status === 'pending' ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" :
                      order.status === 'completed' ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400" :
                      "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                    )}
                  >
                    <option value="pending" className="dark:bg-[#0f0f11]">Pendente</option>
                    <option value="preparing" className="dark:bg-[#0f0f11]">Preparando</option>
                    <option value="completed" className="dark:bg-[#0f0f11]">Concluído</option>
                    <option value="cancelled" className="dark:bg-[#0f0f11]">Cancelado</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => openOrderDetails(order)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400 dark:text-gray-600 hover:text-primary dark:hover:text-primary-light transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 font-black">Nenhum pedido registrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Produtos</h3>
        <Button onClick={() => { setEditingProduct(null); setProductForm({}); setIsProductModalOpen(true); }} className="rounded-xl font-black"><Plus className="w-4 h-4 mr-2" /> Novo Produto</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-white/5 rounded-[2rem] premium-shadow overflow-hidden border border-gray-50 dark:border-white/10 group">
            <div className="relative h-48">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => openEditProduct(product)} className="p-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-xl text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light shadow-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => deleteProduct(product.id)} className="p-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-xl text-gray-600 dark:text-gray-300 hover:text-red-500 shadow-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  product.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                )}>
                  {product.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{product.name}</h4>
                <span className="font-black text-primary dark:text-primary-light">{formatCurrency(product.price)}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 font-bold">{product.description}</p>
              <div className="flex items-center gap-2">
                {product.isBestSeller && <span className="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">Mais Vendido</span>}
                {product.isPromo && <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">Promoção</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Categorias</h3>
        <Button onClick={() => { setEditingCategory(null); setCategoryForm({}); setIsCategoryModalOpen(true); }} className="rounded-xl font-black"><Plus className="w-4 h-4 mr-2" /> Nova Categoria</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] premium-shadow border border-gray-50 dark:border-white/10 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary dark:text-primary-light" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white">{cat.name}</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">Ordem: {cat.order}</p>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditCategory(cat)} className="p-2 text-gray-400 dark:text-gray-600 hover:text-primary dark:hover:text-primary-light"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-400 dark:text-gray-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClientes = () => {
    const uniqueCustomers = Array.from(new Set(orders.map(o => o.customerPhone))).map(phone => {
      const lastOrder = orders.find(o => o.customerPhone === phone);
      const totalSpent = orders.filter(o => o.customerPhone === phone).reduce((acc, o) => acc + o.total, 0);
      const orderCount = orders.filter(o => o.customerPhone === phone).length;
      return { phone, name: lastOrder?.customerName, totalSpent, orderCount };
    });

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Base de Clientes</h3>
        <div className="bg-white dark:bg-white/5 rounded-[2rem] premium-shadow overflow-hidden border border-gray-50 dark:border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">WhatsApp</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pedidos</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Gasto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/10">
              {uniqueCustomers.map((customer, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-black text-gray-900 dark:text-white">{customer.name}</td>
                  <td className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400">{customer.phone}</td>
                  <td className="px-6 py-4 font-black text-gray-900 dark:text-white">{customer.orderCount}</td>
                  <td className="px-6 py-4 font-black text-primary dark:text-primary-light">{formatCurrency(customer.totalSpent)}</td>
                </tr>
              ))}
              {uniqueCustomers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 font-black">Nenhum cliente cadastrado ainda</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAdicionais = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">Gestão de Adicionais</h3>
          <Button onClick={() => { setEditingAddon(null); setAddonForm({}); setIsAddonModalOpen(true); }} className="rounded-xl font-black"><Plus className="w-4 h-4 mr-2" /> Novo Adicional</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {addons.map((addon, i) => (
            <div key={i} className="bg-white dark:bg-white/5 p-6 rounded-3xl premium-shadow border border-gray-50 dark:border-white/10 flex items-center justify-between group">
              <div>
                <p className="font-black text-gray-900 dark:text-white">{addon.name}</p>
                <p className="text-sm font-black text-primary dark:text-primary-light">{formatCurrency(addon.price)}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditAddon(addon)} className="p-2 text-gray-400 dark:text-gray-600 hover:text-primary dark:hover:text-primary-light"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => deleteAddon(addon.id)} className="p-2 text-gray-400 dark:text-gray-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-gray-900 dark:text-white">Configurações da Loja</h3>
      <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] premium-shadow border border-gray-50 dark:border-white/10 max-w-2xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Nome da Loja</label>
              <input type="text" value={tempSettings.name} onChange={e => setTempSettings({...tempSettings, name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">WhatsApp (DDD)</label>
              <input type="text" value={tempSettings.whatsapp} onChange={e => setTempSettings({...tempSettings, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Endereço Completo</label>
            <input type="text" value={tempSettings.address} onChange={e => setTempSettings({...tempSettings, address: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tempo Médio de Entrega</label>
              <input type="text" value={tempSettings.deliveryTime} onChange={e => setTempSettings({...tempSettings, deliveryTime: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Pedido Mínimo (R$)</label>
              <input type="number" value={tempSettings.minOrderValue} onChange={e => setTempSettings({...tempSettings, minOrderValue: parseFloat(e.target.value)})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
            </div>
          </div>
          <Button onClick={() => { updateStoreConfig(tempSettings); toast.success('Configurações salvas!'); }} className="w-full rounded-2xl py-4 text-lg font-black">Salvar Alterações</Button>
        </div>
      </div>
    </div>
  );

  const renderBanners = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Banners Promocionais</h3>
      </div>
      <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] premium-shadow border border-gray-50 dark:border-white/10 max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Banner Principal (URL)</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={tempBanner} 
                onChange={(e) => setTempBanner(e.target.value)}
                className="flex-1 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" 
              />
              <Button onClick={() => { updateBanner(tempBanner); toast.success('Banner atualizado!'); }} className="rounded-2xl px-8 font-black">Salvar</Button>
            </div>
          </div>
          <div className="aspect-video rounded-3xl overflow-hidden border-4 border-gray-50 dark:border-white/10 shadow-inner bg-gray-100 dark:bg-white/5">
            <img src={tempBanner} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderHorarios = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-gray-900 dark:text-white">Horários de Funcionamento</h3>
      <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] premium-shadow border border-gray-50 dark:border-white/10 max-w-2xl">
        <div className="space-y-4">
          {tempHours.map((hour, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-primary dark:text-primary-light" />
                </div>
                <span className="font-black text-gray-900 dark:text-white">{hour.day}</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={hour.open} 
                  onChange={(e) => {
                    const newHours = [...tempHours];
                    newHours[i] = { ...newHours[i], open: e.target.value };
                    setTempHours(newHours);
                  }}
                  className="w-20 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl p-2 text-center font-black text-gray-900 dark:text-white outline-none focus:border-primary" 
                />
                <span className="text-gray-400 dark:text-gray-500 font-black">às</span>
                <input 
                  type="text" 
                  value={hour.close} 
                  onChange={(e) => {
                    const newHours = [...tempHours];
                    newHours[i] = { ...newHours[i], close: e.target.value };
                    setTempHours(newHours);
                  }}
                  className="w-20 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl p-2 text-center font-black text-gray-900 dark:text-white outline-none focus:border-primary" 
                />
                <button 
                  onClick={() => {
                    const newHours = [...tempHours];
                    newHours[i] = { ...newHours[i], closed: !newHours[i].closed };
                    setTempHours(newHours);
                  }} 
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors",
                    hour.closed ? "bg-gray-300 dark:bg-gray-700" : "bg-green-500"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                    hour.closed ? "left-1" : "right-1"
                  )} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={() => { updateOpeningHours(tempHours); toast.success('Horários salvos!'); }} className="w-full mt-8 rounded-2xl py-4 font-black">Salvar Horários</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] flex transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-[#0f0f11] border-r dark:border-white/10 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b dark:border-white/10 flex items-center justify-between">
          <div>
            <h1 className="font-black text-xl text-primary dark:text-primary-light">Açaí Express</h1>
            <p className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-widest">Painel Pro</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
            { id: 'products', label: 'Produtos', icon: Package },
            { id: 'categories', label: 'Categorias', icon: Layers },
            { id: 'adicionais', label: 'Adicionais', icon: Plus },
            { id: 'banners', label: 'Banners', icon: ImageIcon },
            { id: 'horarios', label: 'Horários', icon: Clock },
            { id: 'clientes', label: 'Clientes', icon: Users },
            { id: 'settings', label: 'Configurações', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as AdminTab);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black transition-all",
                activeTab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t dark:border-white/10">
          <button 
            onClick={() => { logout(); navigate('/admin'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center justify-between w-full lg:w-auto">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white capitalize">{activeTab}</h2>
                <p className="text-gray-700 dark:text-gray-200 font-bold text-sm md:text-base">Bem-vindo ao seu painel de controle.</p>
              </div>
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white dark:bg-white/5 rounded-2xl border dark:border-white/10 shadow-sm">
                <Filter className="w-6 h-6 text-primary" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-white/5 px-4 py-2 rounded-xl border dark:border-white/10 font-black text-xs md:text-sm flex items-center gap-2 premium-shadow text-gray-900 dark:text-white">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Loja Aberta
              </div>
              <img src="https://ui-avatars.com/api/?name=Admin&background=6b21a8&color=fff" className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border-2 border-white dark:border-white/10 shadow-lg" alt="Avatar" />
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'categories' && renderCategories()}
              {activeTab === 'adicionais' && renderAdicionais()}
              {activeTab === 'banners' && renderBanners()}
              {activeTab === 'horarios' && renderHorarios()}
              {activeTab === 'clientes' && renderClientes()}
              {activeTab === 'settings' && renderSettings()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProductModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#1a1a1c] w-full max-w-2xl rounded-[2.5rem] p-8 premium-shadow relative z-10 max-h-[90vh] overflow-y-auto border border-transparent dark:border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Nome</label>
                    <input type="text" required value={productForm.name || ''} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Preço Base</label>
                    <input type="number" step="0.01" required value={productForm.price || ''} onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Descrição</label>
                  <textarea rows={3} required value={productForm.description || ''} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">URL da Imagem</label>
                  <input type="text" required value={productForm.image || ''} onChange={(e) => setProductForm({...productForm, image: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Categoria</label>
                    <select required value={productForm.categoryId || ''} onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white">
                      <option value="" className="dark:bg-[#1a1a1c]">Selecionar...</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id} className="dark:bg-[#1a1a1c]">{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-6 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={productForm.isBestSeller || false} onChange={(e) => setProductForm({...productForm, isBestSeller: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary border-gray-300 dark:border-white/10 dark:bg-white/5" />
                      <span className="text-sm font-black text-gray-700 dark:text-gray-300">Mais Vendido</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={productForm.isPromo || false} onChange={(e) => setProductForm({...productForm, isPromo: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary border-gray-300 dark:border-white/10 dark:bg-white/5" />
                      <span className="text-sm font-black text-gray-700 dark:text-gray-300">Promoção</span>
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full rounded-2xl py-4 text-lg font-black">Salvar Produto</Button>
              </form>
            </motion.div>
          </div>
        )}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCategoryModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#1a1a1c] w-full max-md rounded-[2.5rem] p-8 premium-shadow relative z-10 border border-transparent dark:border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveCategory} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Nome da Categoria</label>
                  <input type="text" required value={categoryForm.name || ''} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Ordem de Exibição</label>
                  <input type="number" required value={categoryForm.order || ''} onChange={(e) => setCategoryForm({...categoryForm, order: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
                </div>
                <Button type="submit" className="w-full rounded-2xl py-4 text-lg font-black">Salvar Categoria</Button>
              </form>
            </motion.div>
          </div>
        )}
        {isAddonModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddonModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#1a1a1c] w-full max-w-md rounded-[2.5rem] p-8 premium-shadow relative z-10 border border-transparent dark:border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{editingAddon ? 'Editar Adicional' : 'Novo Adicional'}</h3>
                <button onClick={() => setIsAddonModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveAddon} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Nome do Adicional</label>
                  <input type="text" required value={addonForm.name || ''} onChange={(e) => setAddonForm({...addonForm, name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Preço (R$)</label>
                  <input type="number" step="0.01" required value={addonForm.price || ''} onChange={(e) => setAddonForm({...addonForm, price: parseFloat(e.target.value)})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-primary font-black text-gray-900 dark:text-white" />
                </div>
                <Button type="submit" className="w-full rounded-2xl py-4 text-lg font-black">Salvar Adicional</Button>
              </form>
            </motion.div>
          </div>
        )}
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOrderModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#1a1a1c] w-full max-w-2xl rounded-[2.5rem] p-8 premium-shadow relative z-10 border border-transparent dark:border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Detalhes do Pedido {selectedOrder.id}</h3>
                <button onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Cliente</p>
                    <p className="font-black text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      selectedOrder.status === 'preparing' ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400" :
                      selectedOrder.status === 'pending' ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" :
                      selectedOrder.status === 'completed' ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400" :
                      "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                    )}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 border-b dark:border-white/10 pb-1">Itens do Pedido</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-gray-900 dark:text-white">{item.quantity}x {item.name}</p>
                          {item.variation && <p className="text-[10px] font-black text-primary dark:text-primary-light uppercase">{item.variation.name}</p>}
                          {item.addons.length > 0 && (
                            <p className="text-[10px] text-gray-600 dark:text-gray-300 font-bold">
                              {item.addons.map(g => g.items.map(i => i.name).join(', ')).join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="font-black text-gray-900 dark:text-white">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-white/10 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-primary dark:text-primary-light">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

