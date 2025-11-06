'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Calendar, Clock, ArrowLeft, X, CheckCircle } from 'lucide-react';

interface BookingWithCourt {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled';
  total_price: number;
  created_at: string;
  cancelled_at: string | null;
  court: {
    name: string;
    sport_type: string;
    address: string;
    photo_url: string | null;
  };
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithCourt[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    checkUserAndFetchBookings();
  }, []);

  const checkUserAndFetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUser(user);
    fetchBookings(user.id);
  };

  const fetchBookings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
          id,
          booking_date,
          start_time,
          end_time,
          status,
          total_price,
          created_at,
          cancelled_at,
          court:courts (
            name,
            sport_type,
            address,
            photo_url
          )
        `
        )
        .eq('user_id', userId)
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formattedBookings = (data || []).map((booking: any) => ({
        ...booking,
        court: booking.court,
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancelling(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      if (user) {
        await fetchBookings(user.id);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Erro ao cancelar reserva');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  const isPastBooking = (bookingDate: string, startTime: string) => {
    const now = new Date();
    const booking = new Date(`${bookingDate}T${startTime}`);
    return booking < now;
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && !isPastBooking(b.booking_date, b.start_time)
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'cancelled' || isPastBooking(b.booking_date, b.start_time)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/courts"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Minhas Reservas
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {upcomingBookings.length} reserva{upcomingBookings.length !== 1 ? 's' : ''} ativa
            {upcomingBookings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {upcomingBookings.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              Próximas reservas
            </h3>
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300"
              >
                <div className="flex gap-4 p-6">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {booking.court.photo_url ? (
                      <Image
                        src={booking.court.photo_url}
                        alt={booking.court.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🏟️
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-1 truncate">
                      {booking.court.name}
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                      {booking.court.sport_type}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    R$ {booking.total_price.toFixed(0)}
                  </span>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={cancelling === booking.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors disabled:opacity-50 font-medium"
                  >
                    <X className="w-4 h-4" />
                    {cancelling === booking.id ? 'Cancelando...' : 'Cancelar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pastBookings.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-500 dark:text-slate-400">
              Histórico
            </h3>
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 opacity-60"
              >
                <div className="flex gap-4 p-6">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 grayscale">
                    {booking.court.photo_url ? (
                      <Image
                        src={booking.court.photo_url}
                        alt={booking.court.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🏟️
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg truncate">
                      {booking.court.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {booking.court.sport_type}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </span>
                      </div>
                    </div>

                    {booking.status === 'cancelled' && (
                      <span className="inline-block mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                        Cancelada
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {bookings.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Nenhuma reserva ainda
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Explore as quadras disponíveis e faça sua primeira reserva
            </p>
            <Link
              href="/courts"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Explorar quadras
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
