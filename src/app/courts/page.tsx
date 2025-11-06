'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Star, Search, SlidersHorizontal, LogIn } from 'lucide-react';

interface Court {
  id: string;
  name: string;
  sport_type: string;
  address: string;
  latitude: number;
  longitude: number;
  price_per_hour: number;
  rating: number;
  photo_url: string | null;
  amenities: string[];
}

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [minRating, setMinRating] = useState(0);

  const sportTypes = ['Futebol', 'Tênis', 'Vôlei', 'Basquete', 'Futsal', 'Padel'];
  const supabase = createClient();

  useEffect(() => {
    checkUser();
    fetchCourts();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [courts, searchQuery, selectedSport, priceRange, minRating]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location permission denied', error);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchCourts = async () => {
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setCourts(data || []);
    } catch (error) {
      console.error('Error fetching courts:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...courts];

    if (searchQuery) {
      filtered = filtered.filter(
        (court) =>
          court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          court.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          court.sport_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSport) {
      filtered = filtered.filter((court) => court.sport_type === selectedSport);
    }

    filtered = filtered.filter(
      (court) =>
        court.price_per_hour >= priceRange[0] && court.price_per_hour <= priceRange[1]
    );

    if (minRating > 0) {
      filtered = filtered.filter((court) => court.rating >= minRating);
    }

    setFilteredCourts(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSport('');
    setPriceRange([0, 300]);
    setMinRating(0);
  };

  const hasActiveFilters = searchQuery || selectedSport || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 300;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl h-96 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-2xl">🏟️</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">QuadraJá</h1>
            </Link>
            {!user && (
              <Link
                href="/auth"
                className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
            )}
            {user && (
              <Link
                href="/bookings"
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                Minhas Reservas
              </Link>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, local ou esporte..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                showFilters || hasActiveFilters
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filtros</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Filtros</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Limpar tudo
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Esporte
                </label>
                <div className="flex flex-wrap gap-2">
                  {sportTypes.map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(selectedSport === sport ? '' : sport)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedSport === sport
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Faixa de preço: R$ {priceRange[0]} - R$ {priceRange[1]}/hora
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Avaliação mínima
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        minRating === rating
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      {rating > 0 ? `${rating}+` : 'Todas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {filteredCourts.length} quadra{filteredCourts.length !== 1 ? 's' : ''} disponível
          {filteredCourts.length !== 1 ? 'eis' : ''}
        </h2>

        {filteredCourts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Nenhuma quadra encontrada
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Tente ajustar seus filtros de busca
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => {
              const distance = userLocation
                ? calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    court.latitude,
                    court.longitude
                  )
                : null;

              return (
                <Link
                  key={court.id}
                  href={`/courts/${court.id}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="relative h-56 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    {court.photo_url ? (
                      <Image
                        src={court.photo_url}
                        alt={court.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🏟️
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {court.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 truncate">
                        {court.name}
                      </h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        {court.sport_type}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{court.address.split(',')[0]}</span>
                      {distance && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium ml-1 flex-shrink-0">
                          • {distance.toFixed(1)} km
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1 text-slate-900 dark:text-white">
                        <span className="text-lg font-bold">
                          R$ {court.price_per_hour.toFixed(0)}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          /hora
                        </span>
                      </div>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
                        Ver detalhes →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
