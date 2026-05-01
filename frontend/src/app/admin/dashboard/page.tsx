'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Filter, ShoppingCart, Users, Settings, LogOut, Plus, Search, Edit2, Trash2, TrendingUp, AlertTriangle, ChevronRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import api from '@/utils/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [itemsRes, statsRes] = await Promise.all([
          api.get('/grocery'),
          api.get('/grocery/admin/stats')
        ]);
        setItems(itemsRes.data.items);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAuthenticated, user, router]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      try {
        await api.delete(`/grocery/${id}`);
        setItems(items.filter(i => i.id !== id));
        toast.success('Item removed successfully');
      } catch (err) {
        toast.error('Failed to delete item');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Admin...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-8 flex items-center gap-3 text-primary font-black text-2xl tracking-tight">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Package size={22} />
          </div>
          <span>Fresh<span className="text-slate-800">Gro</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <SidebarItem icon={<Package size={20} />} label="Inventory" />
          <SidebarItem icon={<ShoppingCart size={20} />} label="Orders" />
          <SidebarItem icon={<Users size={20} />} label="Customers" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-danger bg-red-50 rounded-lg hover:bg-danger hover:text-white transition-all duration-300">
              <LogOut size={16} /> Sign Out
            </button>
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform">
              <Settings size={80} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 font-medium">Monitoring inventory and system activity.</p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search products..." className="input-field pl-12 md:w-64 bg-white/50" />
            </div>
            <Link href="/admin/grocery/new" className="btn-primary h-12 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 whitespace-nowrap">
              <Plus size={20} /> Add New Item
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard title="Total Products" value={stats?.total || 0} icon={<Package className="text-primary" />} trend="+12%" />
          <StatCard title="Active Orders" value="24" icon={<ShoppingCart className="text-secondary" />} trend="+5%" />
          <StatCard title="Total Customers" value="1,248" icon={<Users className="text-indigo-500" />} trend="+18%" />
          <StatCard
            title="Low Stock"
            value={stats?.lowStock || 0}
            icon={<AlertTriangle className="text-danger" />}
            trend="-2"
            isNegative
          />
        </div>

        {/* Inventory Table Card */}
        <div className="card border-none shadow-premium overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
            <div>
              <h2 className="text-xl font-black text-slate-800">Inventory Management</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Manage and update your grocery stock levels.</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                <Filter size={20} />
              </button>
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Stock</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🍎</div>}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">ID: {item.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="font-black text-slate-800">${item.price}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-center">
                        <span className={`font-black text-lg ${item.stock <= 10 ? 'text-danger animate-pulse' : 'text-slate-700'}`}>{item.stock}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.unit || 'units'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        {item.isAvailable ? (
                          <span className="badge-success badge text-[10px]">Active</span>
                        ) : (
                          <span className="badge-danger badge text-[10px]">Restocking</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href={`/admin/grocery/edit/${item.id}`} className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm">
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-white border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400">Showing {items.length} products in inventory</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-100 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Previous</button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors">Next Page</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 group ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
      <div className="flex items-center gap-4">
        {icon}
        <span className="font-bold">{label}</span>
      </div>
      {active && <ChevronRight size={16} />}
    </div>
  );
}

function StatCard({ title, value, icon, trend, isNegative }: { title: string, value: any, icon: any, trend: string, isNegative?: boolean }) {
  return (
    <div className="card p-8 border-none shadow-premium relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white group-hover:shadow-md transition-all">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-black tracking-tighter ${isNegative ? 'text-danger' : 'text-success'}`}>
          <TrendingUp size={14} className={isNegative ? 'rotate-180' : ''} />
          {trend}
        </div>
      </div>
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-4xl font-black text-slate-800">{value}</p>

      {/* Decorative pulse for low stock */}
      {isNegative && parseInt(value) > 0 && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-danger rounded-full animate-ping" />
      )}
    </div>
  );
}
