'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Search, Heart, Star, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { setItems, setFeaturedItems, setLoading } from '@/store/slices/grocerySlice';
import { addToCart } from '@/store/slices/cartSlice';
import { RootState } from '@/store/store';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import toast from 'react-hot-toast';

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, featuredItems, loading } = useSelector((state: RootState) => state.grocery);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const [itemsRes, featuredRes] = await Promise.all([
          api.get('/grocery'),
          api.get('/grocery/featured'),
        ]);
        dispatch(setItems(itemsRes.data.items));
        dispatch(setFeaturedItems(featuredRes.data));
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      <CartSidebar />
      
      {/* Hero Section */}
      <section className="container pt-[120px] pb-10">
        <div className="glass rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-br from-primary to-primary-dark text-white border-none min-h-[400px] overflow-hidden relative">
          <div className="flex-1 z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
            >
              Freshness Delivered <br /> to Your Doorstep
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl opacity-90 mb-8 max-w-[500px]"
            >
              High-quality groceries from local farms at the best prices.
            </motion.p>
          </div>
          <div className="flex-1 flex justify-center relative z-10">
             <div className="w-[300px] h-[300px] bg-white/20 rounded-full blur-[60px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-[180px] drop-shadow-2xl"
             >
               🥦
             </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredItems.length > 0 && (
        <section className="container mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">Featured Deals <span className="animate-bounce">🔥</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="container pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <h2 className="text-3xl font-black text-slate-800">Available Groceries</h2>
          <div className="relative w-full md:w-[350px]">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search groceries..." 
              className="input-field pl-12 h-14 bg-white/80" 
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading fresh items...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence mode='popLayout'>
              {items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ item }: { item: any }) {
  const dispatch = useDispatch();
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="card group overflow-hidden border-none shadow-premium bg-white"
    >
      <div className="relative w-full h-56 bg-slate-50 overflow-hidden">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-7xl bg-slate-50">
            📦
          </div>
        )}
        
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur text-slate-400 hover:text-red-500 shadow-sm flex items-center justify-center transition-colors duration-300">
          <Heart size={20} />
        </button>
        
        {item.discountPrice && (
          <div className="absolute top-4 left-4 bg-danger text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            -{Math.round(((item.price - item.discountPrice) / item.price) * 100)}%
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
           <div className="flex items-center gap-1">
             <Star size={14} className="fill-yellow-400 text-yellow-400" />
             <span className="text-xs font-black text-slate-600">4.8</span>
           </div>
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Organic</span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-primary">${item.discountPrice || item.price}</span>
              {item.discountPrice && (
                <span className="text-sm text-slate-400 line-through font-bold">${item.price}</span>
              )}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.stock > 0 ? (item.stock <= 10 ? 'text-danger' : 'text-slate-400') : 'text-slate-300'}`}>
              {item.stock > 0 ? (
                <span className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.stock <= 10 ? 'bg-danger animate-pulse' : 'bg-success'}`} />
                  {item.stock} {item.unit || 'units'} left
                </span>
              ) : 'Out of Stock'}
            </span>
          </div>
          
          <button 
            onClick={() => {
              if (item.stock > 0) {
                dispatch(addToCart({ id: item.id, name: item.name, price: item.discountPrice || item.price, stock: item.stock, image: item.image, quantity: 1 }));
                toast.success(`${item.name} added!`, {
                  style: { borderRadius: '12px', background: '#333', color: '#fff' }
                });
              } else {
                toast.error('Out of stock');
              }
            }}
            disabled={item.stock <= 0}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              item.stock > 0 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-90' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
