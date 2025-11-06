'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Calendar, Clock, User, MapPin } from 'lucide-react';

interface Reservation {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  created_at: string;
  court: {
    name: string;
    sport_type: string;
    club_location: string;
  };
  profile: {
    full_name: string;
  };
}

export default function OwnerReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today'>('upcoming');

  const supabase = createClient();

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const fetchReservations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      const { data: courts } = await supabase
        .from('courts')
        .select('id')
        .eq('owner_id', user.id);

      const courtIds = courts?.map(c => c.id) || [];

      let query = supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          start_time,
          end_time,
          total_price,
          status,
          created_at,
          court:courts (
            name,
            sport_type,
            club_location
          ),
          profile:profiles (
            full_name
          )
        `)
        .in('court_id', courtIds)
        .eq('status', 'confirmed')
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true });

      const today = new Date().toISOString().split('T')[0];

      if (filter === 'upcoming') {
        query = query.gte('booking_date', today);
      } else if (filter === 'today') {
        query = query.eq('booking_date', today);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedReservations = (data || []).map((booking: any) => ({
        ...booking,
        court: booking.court,
        profile: booking.profile,
      }));

      setReservations(formattedReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/owner/dashboard"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar ao Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Reservas
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {reservations.length} reserva{reservations.length !== 1 ? 's' : ''} encontrada{reservations.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-white dark:bg-slate-800 rounded-xl inline-flex">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                filter === 'upcoming'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Próximas
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                filter === 'today'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todas
            </button>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              As reservas aparecerão aqui quando os clientes agendarem
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {reservation.court.name}
                      </h3>
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-lg">
                        {reservation.court.sport_type}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="capitalize">{formatDate(reservation.booking_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{reservation.profile.full_name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{reservation.court.club_location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      R$ {reservation.total_price.toFixed(0)}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-lg">
                      Confirmada
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
