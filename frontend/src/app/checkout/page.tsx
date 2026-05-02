'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MapPin, CreditCard, ShoppingBag, ArrowLeft, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import { clearCart } from '@/store/slices/cartSlice';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push('/');
    }
  }, [items, router, success]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return toast.error('Please enter delivery address');

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        groceryItemId: item.id,
        quantity: item.quantity
      }));

      await api.post('/orders', {
        items: orderItems,
        deliveryAddress: address,
        notes: 'Customer order from web'
      });

      setSuccess(true);
      toast.success('Order placed successfully! 🎉');
      dispatch(clearCart());
      setTimeout(() => {
        router.push('/my-orders');
      }, 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-lg w-full p-12 flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
            <CheckCircle size={60} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">Order Confirmed!</h1>
          <p className="text-slate-500 mb-10 text-lg">
            Thank you for shopping with us. Your groceries will be delivered to <span className="font-bold text-slate-700">{address}</span> within 60 minutes.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full btn-primary py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-bg-main min-h-screen pb-20">
      <Navbar />

      <div className="container pt-[120px]">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Basket
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Delivery Information</h2>
                  <p className="text-sm text-slate-400 font-medium">Where should we deliver your groceries?</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Shipping Address</label>
                <textarea
                  placeholder="Street Address, Apartment, Suite, House No, etc..."
                  className="input-field min-h-[140px] pt-4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-400 ml-1 mt-2 flex items-center gap-1">
                  <Clock size={12} /> Standard delivery time: 45-60 mins
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Payment Method</h2>
                  <p className="text-sm text-slate-400 font-medium">Select how you'd like to pay</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-primary bg-primary/5 p-6 rounded-2xl flex items-center justify-between cursor-pointer group shadow-lg shadow-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 border-4 border-primary rounded-full bg-white shadow-inner flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-bold text-slate-800">Cash on Delivery</span>
                  </div>
                  <div className="text-primary font-black text-xs uppercase tracking-widest">Active</div>
                </div>

                <div className="border-2 border-slate-100 bg-slate-50 p-6 rounded-2xl flex items-center justify-between opacity-60 cursor-not-allowed grayscale">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 border-2 border-slate-300 rounded-full bg-white" />
                    <span className="font-bold text-slate-400">Card Payment</span>
                  </div>
                  <div className="bg-slate-200 text-slate-500 px-2 py-1 rounded text-[10px] font-black uppercase">Soon</div>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  Your payment security is our priority. For now, we only support Cash on Delivery to ensure you inspect your items before paying.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-8  top-[120px]"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                Order Summary <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500">{items.length}</span>
              </h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex mt-5 justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-xl">🍎</span>}
                        </div>
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">{item.quantity}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700 truncate max-w-[140px] group-hover:text-primary transition-colors">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-slate-400 font-bold text-sm">
                  <span>Subtotal</span>
                  <span>${Number(totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold text-sm">
                  <span>Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold text-sm">
                  <span>Delivery Fee</span>
                  <span className="text-success uppercase">Free</span>
                </div>

                <div className="h-px bg-slate-100 my-4" />

                <div className="flex justify-between items-center mb-8">
                  <span className="text-slate-800 font-black text-lg">Order Total</span>
                  <span className="text-3xl font-black text-primary">${Number(totalAmount).toFixed(2)}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !address}
                  className="w-full flex items-center justify-center btn-primary py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 disabled:opacity-50 group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Place Order Now <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
