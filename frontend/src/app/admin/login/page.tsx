'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '@/utils/api';
import { setCredentials } from '@/store/slices/authSlice';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('razzak172758@gmail.com');
  const [password, setPassword] = useState('Admin1234');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.user.role !== 'admin') {
        toast.error('Access denied. This portal is for admins only.');
        return;
      }

      dispatch(setCredentials(res.data));
      toast.success('Welcome Back, Administrator!', {
        icon: '🔐',
        style: { borderRadius: '12px', background: '#333', color: '#fff' }
      });
      router.push('/admin/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message;
      const errorMessage = Array.isArray(message) ? message[0] : (message || 'Login failed');
      toast.error(errorMessage, {
        style: { borderRadius: '12px', background: '#333', color: '#fff' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-800/20 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <span className="text-3xl font-black text-slate-800 tracking-tight">Admin<span className="text-primary">Portal</span></span>
          </Link>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Secure Login</h1>
          <p className="text-slate-500 font-medium text-lg">Administrative Access Only</p>
        </div>

        <div className="card p-10 bg-white/70 backdrop-blur-xl border-white shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Admin Email</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 h-14 bg-white/50"
                  placeholder="admin@freshgro.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
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
              className="w-full flex justify-center btn-primary h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 disabled:opacity-50 group bg-slate-800 hover:bg-slate-900 border-none"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Admin Login <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-500 font-bold">
          Not an admin? <Link href="/login" className="text-primary hover:underline">User Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
