'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '@/store/store';
import toast from 'react-hot-toast';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      // toast.error('Please login to continue');
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
