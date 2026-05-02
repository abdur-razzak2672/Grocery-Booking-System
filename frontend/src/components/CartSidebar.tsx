'use client';

import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleCart, removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, totalAmount, isOpen } = useSelector((state: RootState) => state.cart);

  const handleCheckout = () => {
    dispatch(toggleCart());
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleCart())}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1100]"
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[1200] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">My Basket</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{items.length} Items</p>
                </div>
              </div>
              <button 
                onClick={() => dispatch(toggleCart())} 
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={60} className="text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Your basket is empty</h3>
                  <p className="text-slate-400 mb-8 max-w-[240px]">Looks like you haven't added anything to your basket yet.</p>
                  <button 
                    onClick={() => dispatch(toggleCart())} 
                    className="btn-primary py-3 px-8 rounded-full"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="flex gap-4 p-4 rounded-2xl border border-slate-50 bg-white hover:border-primary/20 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🍎</div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-800 truncate pr-2">{item.name}</h4>
                          <button 
                            onClick={() => dispatch(removeFromCart(item.id))} 
                            className="text-slate-300 hover:text-danger transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="font-black text-primary text-lg">${item.price}</span>
                          
                          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-100">
                            <button 
                              disabled={item.quantity <= 1}
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                              className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-slate-400 hover:text-primary shadow-sm border border-slate-100 disabled:opacity-30 transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-slate-700 min-w-[20px] text-center">{item.quantity}</span>
                            <button 
                              disabled={item.quantity >= item.stock}
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-slate-400 hover:text-primary shadow-sm border border-slate-100 disabled:opacity-30 transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-between text-slate-400 font-bold text-sm">
                    <span>Subtotal</span>
                    <span>${Number(totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold text-sm">
                    <span>Delivery</span>
                    <span className="text-success uppercase">Free</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-800 font-black text-lg">Total Amount</span>
                    <span className="text-3xl font-black text-primary">${Number(totalAmount).toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full btn-primary py-4 rounded-2xl text-lg flex items-center justify-center gap-3 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-center text-xs text-slate-400 font-medium">Secure checkout powered by FreshGro</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
