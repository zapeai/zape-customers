'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Star, Clock, Calendar, ExternalLink, LogIn } from 'lucide-react';

interface Court {
  id: string;
  name: string;
  sport_type: string;
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  price_per_hour: number;
  rating: number;
  photo_url: string | null;
  amenities: string[];
  opening_time: string;
  closing_time: string;
}

interface Booking {
  start_time: string;
  end_time: string;
}

export default function CourtDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courtId = params.id as string;
  const [court, setCourt] = useState<Court | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [booking, setBooking] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkUser();
    fetchCourt();
    fetchBookings();
  }, [courtId, selectedDate]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchCourt = async () => {
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('id', courtId)
        .maybeSingle();

      if (error) throw error;
      setCourt(data);
    } catch (error) {
      console.error('Error fetching court:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('court_id', courtId)
        .eq('booking_date', selectedDate)
        .eq('status', 'confirmed');

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const generateTimeSlots = () => {
    if (!court) return [];

    const slots: string[] = [];
    const [openHour] = court.opening_time.split(':').map(Number);
    const [closeHour] = court.closing_time.split(':').map(Number);

    for (let hour = openHour; hour < closeHour; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeStr);
    }

    return slots;
  };

  const isSlotBooked = (slot: string) => {
    return bookings.some((booking) => booking.start_time === `${slot}:00`);
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    setBooking(true);
    try {
      const [hour] = selectedSlot.split(':').map(Number);
      const endHour = hour + 1;

      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        court_id: courtId,
        booking_date: selectedDate,
        start_time: `${selectedSlot}:00`,
        end_time: `${endHour.toString().padStart(2, '0')}:00:00`,
        total_price: court!.price_per_hour,
        status: 'confirmed',
      });

      if (error) throw error;

      router.push('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Erro ao criar reserva');
    } finally {
      setBooking(false);
    }
  };

  const openInMaps = () => {
    if (!court) return;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${court.latitude},${court.longitude}`,
      '_blank'
    );
  };

  if (loading || !court) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 px-4">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-6" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded mb-3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        </div>
      </div>
    );
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 mb-6">
          <div className="relative h-96 bg-slate-200 dark:bg-slate-700 overflow-hidden">
            {court.photo_url ? (
              <Image
                src={court.photo_url}
                alt={court.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                🏟️
              </div>
            )}
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {court.name}
                </h1>
                <p className="text-xl text-emerald-600 dark:text-emerald-400 font-medium">
                  {court.sport_type}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 rounded-xl">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                  {court.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {court.description && (
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {court.description}
              </p>
            )}

            <button
              onClick={openInMaps}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
            >
              <MapPin className="w-6 h-6" />
              <span className="text-lg">{court.address}</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>

            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <Clock className="w-6 h-6 text-emerald-500" />
              <span className="font-bold text-2xl">
                R$ {court.price_per_hour.toFixed(0)}
              </span>
              <span className="text-lg text-slate-500 dark:text-slate-400">/hora</span>
            </div>

            {court.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-lg">
                  Comodidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {court.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-emerald-500" />
            Horários disponíveis
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Selecione a data
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(null);
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white text-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
              Escolha o horário
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {timeSlots.map((slot) => {
                const booked = isSlotBooked(slot);
                const selected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    onClick={() => !booked && setSelectedSlot(slot)}
                    disabled={booked}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      booked
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : selected
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-105'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedSlot && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Horário selecionado
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedSlot} - {parseInt(selectedSlot) + 1}:00
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {court.price_per_hour.toFixed(0)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleBooking}
                disabled={booking}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
              >
                {!user && <LogIn className="w-5 h-5" />}
                {booking ? 'Reservando...' : user ? `Confirmar reserva` : 'Fazer login para reservar'}
              </button>
            </div>
          )}

          {!selectedSlot && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-6">
              Selecione um horário para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
