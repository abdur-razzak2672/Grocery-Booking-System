'use client';

import { ShoppingCart, User, LogIn, Store, Menu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleCart } from '@/store/slices/cartSlice';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const cartItemsCount = items.reduce((acc: number, item) => acc + item.quantity, 0);

  return (
    <nav className="glass fixed top-0 left-0 right-0 h-20 z-[1000] flex items-center shadow-sm">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <Store size={22} />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">Fresh<span className="text-primary">Gro</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/" label="Home" active />
          {isAuthenticated && (
            <NavLink href="/my-orders" label="My Bookings" />
          )}
          {user?.role === 'admin' && (
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-emerald-50 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative p-2 text-slate-600 hover:text-primary transition-colors group"
          >
            <ShoppingCart size={26} />
            {cartItemsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary text-white border-2 border-white rounded-full w-6 h-6 text-[10px] flex items-center justify-center font-black shadow-lg"
              >
                {cartItemsCount}
              </motion.span>
            )}
          </button>

          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

          {isAuthenticated ? (
            <Link
              href="#"
              className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1.5 pr-4 rounded-full hover:shadow-md transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={18} />}
              </div>
              <span className="text-sm font-bold text-slate-700 hidden sm:inline">{user?.firstName}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="btn-primary py-2.5 px-6 rounded-full text-sm hidden sm:flex"
            >
              Sign In
            </Link>
          )}

          <button className="md:hidden text-slate-600">
            <Menu size={26} />
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, active = false }: { href: string, label: string, active?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative font-bold text-[15px] transition-colors duration-300 hover:text-primary ${active ? 'text-primary' : 'text-slate-500'}`}
    >
      {label}
      {active && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
        />
      )}
    </Link>
  );
}
