import Link from 'next/link';
import { Search, MapPin, Star, TrendingUp, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Search,
      title: 'Encontre facilmente',
      description: 'Busque quadras próximas a você com filtros inteligentes',
    },
    {
      icon: Clock,
      title: 'Reserve em segundos',
      description: 'Veja horários disponíveis e reserve instantaneamente',
    },
    {
      icon: Shield,
      title: 'Pagamento seguro',
      description: 'Todas as transações são protegidas e verificadas',
    },
    {
      icon: TrendingUp,
      title: 'Melhores avaliações',
      description: 'Escolha entre as quadras mais bem avaliadas',
    },
  ];

  const popularSports = [
    { name: 'Futebol', emoji: '⚽', color: 'from-green-400 to-green-600' },
    { name: 'Tênis', emoji: '🎾', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Vôlei', emoji: '🏐', color: 'from-blue-400 to-blue-600' },
    { name: 'Basquete', emoji: '🏀', color: 'from-orange-400 to-orange-600' },
    { name: 'Futsal', emoji: '⚽', color: 'from-emerald-400 to-emerald-600' },
    { name: 'Padel', emoji: '🎾', color: 'from-pink-400 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-2xl">🏟️</span>
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                QuadraJá
              </span>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Reserve sua quadra
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                em poucos segundos
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
              Encontre e reserve quadras esportivas próximas a você. Simples, rápido e seguro.
            </p>
            <Link
              href="/courts"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 text-lg"
            >
              <Search className="w-6 h-6" />
              Explorar quadras
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {popularSports.map((sport) => (
              <div
                key={sport.name}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${sport.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <span className="text-3xl">{sport.emoji}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {sport.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Reserve sua quadra em 3 passos simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-emerald-50 mb-10">
            Encontre a quadra perfeita para seu próximo jogo
          </p>
          <Link
            href="/courts"
            className="inline-flex items-center gap-3 bg-white text-emerald-600 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
          >
            <MapPin className="w-6 h-6" />
            Ver quadras disponíveis
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏟️</span>
            </div>
            <span className="text-2xl font-bold text-white">QuadraJá</span>
          </div>
          <p className="text-slate-400">
            © 2025 QuadraJá. Reserve sua quadra em segundos.
          </p>
        </div>
      </footer>
    </div>
  );
}
