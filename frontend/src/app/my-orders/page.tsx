'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Calendar, MapPin, ChevronRight, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import api from '@/utils/api';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyOrdersPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'processing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle2 size={14} />;
      case 'processing': return <Clock size={14} />;
      case 'shipped': return <Truck size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-main pb-20">
      <Navbar />
      
      <div className="container pt-[120px]">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Bookings</h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Track and manage your recent grocery orders.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching your history...</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-16 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
              <Package size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No orders found yet</h2>
            <p className="text-slate-400 mb-8 max-w-sm">You haven't placed any orders yet. Start shopping to see your history here!</p>
            <button onClick={() => router.push('/')} className="btn-primary px-8 py-3 rounded-full">Explore Groceries</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0, transition: { delay: index * 0.1 } }} 
                  key={order.id} 
                  className="card group hover:border-primary/30"
                >
                  <div className="p-8">
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Order Identifier</p>
                          <p className="font-bold text-slate-800">#ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="h-10 w-px bg-slate-100 hidden sm:block" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Placed On</p>
                          <div className="flex items-center gap-2 font-bold text-slate-800">
                             <Calendar size={14} className="text-primary" />
                             {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`badge flex items-center gap-1.5 px-4 py-1.5 border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="text-[11px] font-black tracking-wider uppercase">{order.status}</span>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">Items Summary</p>
                        <div className="flex flex-wrap gap-4">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3 bg-slate-50/50 p-2 pr-4 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                               <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-xl overflow-hidden">
                                  {item.groceryItem.image ? <img src={item.groceryItem.image} className="w-full h-full object-cover" /> : '🍎'}
                               </div>
                               <div>
                                  <p className="text-xs font-bold text-slate-700">{item.groceryItem.name}</p>
                                  <p className="text-[10px] font-black text-primary uppercase">{item.quantity} {item.groceryItem.unit || 'units'}</p>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                             <MapPin size={16} className="text-slate-400 mt-0.5" />
                             <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Ship To</p>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed">{order.deliveryAddress}</p>
                             </div>
                          </div>
                          <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                             <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Paid</p>
                                <p className="text-2xl font-black text-primary">${Number(order.totalAmount).toFixed(2)}</p>
                             </div>
                             <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">COD</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
