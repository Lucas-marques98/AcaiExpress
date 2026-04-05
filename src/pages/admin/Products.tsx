import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../../components/Button';
import { Product } from '../../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const Products: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, form);
      toast.success('Produto atualizado!');
    } else {
      addProduct(form as Omit<Product, 'id'>);
      toast.success('Produto adicionado!');
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setForm({});
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900">Produtos</h3>
        <Button onClick={() => { setEditingProduct(null); setForm({}); setIsModalOpen(true); }} className="rounded-xl"><Plus className="w-4 h-4 mr-2" /> Novo Produto</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-[2rem] premium-shadow overflow-hidden border border-gray-50 group">
            <div className="relative h-48">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => openEdit(product)} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-600 hover:text-primary shadow-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => deleteProduct(product.id)} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-600 hover:text-red-500 shadow-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  product.isBestSeller ? "bg-accent text-white" : "bg-white/90 text-gray-600"
                )}>
                  {categories.find(c => c.id === product.categoryId)?.name || 'Sem Categoria'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-gray-900 text-lg">{product.name}</h4>
                <span className="font-black text-primary">{formatCurrency(product.price)}</span>
              </div>
              <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-4">{product.description}</p>
              <div className="flex gap-2">
                {product.isBestSeller && <span className="px-2 py-1 bg-accent/10 text-accent text-[9px] font-black uppercase rounded-lg">Mais Vendido</span>}
                {product.isPromo && <span className="px-2 py-1 bg-green-100 text-green-600 text-[9px] font-black uppercase rounded-lg">Promoção</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 premium-shadow relative z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome</label>
                    <input type="text" required value={form.name || ''} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço Base</label>
                    <input type="number" step="0.01" required value={form.price || ''} onChange={(e) => setForm({...form, price: parseFloat(e.target.value)})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</label>
                  <textarea rows={3} required value={form.description || ''} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL da Imagem</label>
                  <input type="text" required value={form.image || ''} onChange={(e) => setForm({...form, image: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</label>
                    <select required value={form.categoryId || ''} onChange={(e) => setForm({...form, categoryId: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold">
                      <option value="">Selecionar...</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-6 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isBestSeller || false} onChange={(e) => setForm({...form, isBestSeller: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary border-gray-300" />
                      <span className="text-sm font-bold text-gray-700">Mais Vendido</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isPromo || false} onChange={(e) => setForm({...form, isPromo: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary border-gray-300" />
                      <span className="text-sm font-bold text-gray-700">Promoção</span>
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full rounded-2xl py-4 text-lg">Salvar Produto</Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
