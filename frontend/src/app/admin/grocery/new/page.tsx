'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/utils/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Package, Image as ImageIcon, Tag, DollarSign, Info } from 'lucide-react';

export default function GroceryFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    unit: 'kg',
    image: '',
    isAvailable: true,
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchItem = async () => {
        try {
          const res = await api.get(`/grocery/${id}`);
          const item = res.data;
          setFormData({
            name: item.name || '',
            description: item.description || '',
            price: item.price?.toString() || '',
            discountPrice: item.discountPrice?.toString() || '',
            stock: item.stock?.toString() || '0',
            unit: item.unit || 'kg',
            image: item.image || '',
            isAvailable: item.isAvailable ?? true,
            isFeatured: item.isFeatured ?? false
          });
        } catch (err) {
          toast.error('Failed to fetch item details');
          router.push('/admin/dashboard');
        }
      };
      fetchItem();
    }
  }, [isEdit, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stock: parseInt(formData.stock),
        unit: formData.unit,
        image: formData.image,
        isAvailable: formData.isAvailable,
        isFeatured: formData.isFeatured
      };

      if (isEdit) {
        await api.patch(`/grocery/${id}`, payload);
        toast.success('Product updated successfully', { icon: '✨' });
      } else {
        await api.post('/grocery', payload);
        toast.success('Product added successfully', { icon: '🎁' });
      }
      
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main pb-20">
      <header className="bg-white border-b border-slate-100 py-6 sticky top-0 z-40">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory Management</p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <Link href="/admin/dashboard" className="btn bg-white border border-slate-200 text-slate-500 hover:bg-slate-50">Cancel</Link>
             <button 
               onClick={handleSubmit} 
               disabled={loading}
               className="btn-primary px-8 flex items-center gap-2 shadow-xl shadow-primary/20"
             >
               {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={20} /> {isEdit ? 'Update' : 'Create'}</>}
             </button>
          </div>
        </div>
      </header>

      <main className="container pt-12 max-w-5xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="card p-8">
               <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                  <Info size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-slate-800">Basic Information</h2>
               </div>
               
               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Product Name</label>
                    <div className="relative group">
                      <Package size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="e.g. Organic Cavendish Bananas"
                        className="input-field pl-12 h-14"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                    <textarea 
                      placeholder="Enter detailed product description, origin, and nutritional info..."
                      className="input-field min-h-[160px] pt-4"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                 </div>
               </div>
            </section>

            <section className="card p-8">
               <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                  <DollarSign size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-slate-800">Pricing & Inventory</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Base Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="input-field h-14 font-bold text-lg"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Discount Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="input-field h-14 font-bold text-lg text-emerald-600 bg-emerald-50/30 border-emerald-100"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      className="input-field h-14 font-bold text-lg"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Measurement Unit</label>
                    <select 
                      className="input-field h-14 font-bold"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="unit">Unit (pcs)</option>
                      <option value="pack">Pack</option>
                      <option value="ltr">Liter (ltr)</option>
                    </select>
                 </div>
               </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="card p-8">
               <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                  <Tag size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-slate-800">Status</h2>
               </div>
               
               <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-700">Availability Status</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isAvailable: !formData.isAvailable})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.isAvailable ? 'bg-primary' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isAvailable ? 'right-1' : 'left-1'}`} />
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-700">Featured Product</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.isFeatured ? 'bg-amber-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isFeatured ? 'right-1' : 'left-1'}`} />
                    </button>
                 </div>
               </div>
            </section>

            <section className="card p-8">
               <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                  <ImageIcon size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-slate-800">Product Media</h2>
               </div>
               
               <div className="space-y-6">
                 <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative group">
                    {formData.image ? (
                      <>
                        <img src={formData.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button type="button" onClick={() => setFormData({...formData, image: ''})} className="text-white font-bold text-xs underline">Remove Image</button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <ImageIcon size={40} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-xs font-bold text-slate-400">Preview will appear here</p>
                      </div>
                    )}
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Image URL</label>
                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/..."
                      className="input-field h-12 text-sm"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter ml-1">Please provide a direct image link.</p>
                 </div>
               </div>
            </section>
          </div>
        </form>
      </main>
    </div>
  );
}
