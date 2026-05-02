'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import toast from 'react-hot-toast';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      router.push('/login?redirect=/admin/dashboard');
    } else if (user?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Verifying Admin Access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
