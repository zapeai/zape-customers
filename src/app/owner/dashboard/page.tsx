'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Plus, Building2, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalCourts: number;
  todayBookings: number;
  monthRevenue: number;
  activeBookings: number;
}

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourts: 0,
    todayBookings: 0,
    monthRevenue: 0,
    activeBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || profile.user_role !== 'club_owner') {
      router.push('/courts');
      return;
    }

    setUser(user);
    setProfile(profile);
    await fetchStats(user.id);
  };

  const fetchStats = async (ownerId: string) => {
    try {
      const { data: courts } = await supabase
        .from('courts')
        .select('id')
        .eq('owner_id', ownerId);

      const courtIds = courts?.map(c => c.id) || [];

      const today = new Date().toISOString().split('T')[0];
      const { data: todayBookings } = await supabase
        .from('bookings')
        .select('id')
        .in('court_id', courtIds)
        .eq('booking_date', today)
        .eq('status', 'confirmed');

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const { data: monthBookings } = await supabase
        .from('bookings')
        .select('total_price')
        .in('court_id', courtIds)
        .gte('booking_date', startOfMonth.toISOString().split('T')[0])
        .eq('status', 'confirmed');

      const monthRevenue = monthBookings?.reduce((sum, b) => sum + b.total_price, 0) || 0;

      const { data: activeBookings } = await supabase
        .from('bookings')
        .select('id')
        .in('court_id', courtIds)
        .gte('booking_date', today)
        .eq('status', 'confirmed');

      setStats({
        totalCourts: courts?.length || 0,
        todayBookings: todayBookings?.length || 0,
        monthRevenue,
        activeBookings: activeBookings?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl animate-pulse mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie suas quadras e reservas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total de Quadras</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalCourts}</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Reservas Hoje</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.todayBookings}</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Receita Mensal</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              R$ {stats.monthRevenue.toFixed(0)}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Reservas Ativas</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeBookings}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/owner/courts"
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Gerenciar Quadras
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Adicione, edite ou remova suas quadras
            </p>
          </Link>

          <Link
            href="/owner/reservations"
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Ver Reservas
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Acompanhe todas as reservas das suas quadras
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
