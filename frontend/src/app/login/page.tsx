'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '@/utils/api';
import { setCredentials } from '@/store/slices/authSlice';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('razzak172758@gmail.com');
  const [password, setPassword] = useState('Admin1234');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAdminQuickLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { 
        email: 'razzak172758@gmail.com', 
        password: 'Admin1234' 
      });
      dispatch(setCredentials(res.data));
      toast.success('Welcome Back, Admin!', {
        icon: '🔐',
        style: { borderRadius: '12px', background: '#333', color: '#fff' }
      });
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error('Admin login failed. Make sure DB is seeded.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(res.data));
      toast.success(`Welcome back, ${res.data.user.firstName}!`, {
        icon: '👋',
        style: { borderRadius: '12px', background: '#333', color: '#fff' }
      });
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      
      if (redirect) {
        router.push(redirect);
      } else if (res.data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <span className="text-3xl font-black text-slate-800 tracking-tight">Fresh<span className="text-primary">Gro</span></span>
          </Link>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium text-lg">Log in to manage your bookings</p>
        </div>

        <div className="card p-10 bg-white/70 backdrop-blur-xl border-white shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 h-14 bg-white/50"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 h-14 bg-white/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Or Securely</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <button 
            onClick={handleAdminQuickLogin}
            disabled={loading}
            className="w-full h-14 border-2 border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-center gap-3 text-slate-600 font-bold hover:bg-slate-100 hover:border-slate-200 transition-all active:scale-95 group"
          >
            <UserIcon size={20} className="text-primary group-hover:scale-110 transition-transform" />
            Admin Quick Login
          </button>
        </div>

        <p className="text-center mt-8 text-slate-500 font-bold">
          Don't have an account? <Link href="/register" className="text-primary hover:underline">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}
