import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/Button';
import { Category } from '../../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<Partial<Category>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, form);
      toast.success('Categoria atualizada!');
    } else {
      addCategory(form as Omit<Category, 'id'>);
      toast.success('Categoria adicionada!');
    }
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm({});
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setForm(category);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900">Categorias</h3>
        <Button onClick={() => { setEditingCategory(null); setForm({}); setIsModalOpen(true); }} className="rounded-xl"><Plus className="w-4 h-4 mr-2" /> Nova Categoria</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-6 rounded-[2rem] premium-shadow border border-gray-50 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-primary">
                {category.order}
              </div>
              <div>
                <h4 className="font-black text-gray-900">{category.name}</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordem: {category.order}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(category)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => deleteCategory(category.id)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 premium-shadow relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome da Categoria</label>
                  <input type="text" required value={form.name || ''} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ordem de Exibição</label>
                  <input type="number" required value={form.order || ''} onChange={(e) => setForm({...form, order: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary font-bold" />
                </div>
                <Button type="submit" className="w-full rounded-2xl py-4 text-lg">Salvar Categoria</Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
