'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import api from '@/utils/api';
import { setCredentials, setLoading } from '@/store/slices/authSlice';
import { Toaster } from 'react-hot-toast';

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/users/profile');
          dispatch(setCredentials({ user: res.data, accessToken: token }));
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setMounted(true);
    };
    initAuth();
  }, [dispatch]);

  if (!mounted) return null; // Prevent hydration mismatch

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster position="top-center" reverseOrder={false} />
      <AuthLoader>{children}</AuthLoader>
    </Provider>
  );
}
