'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Chrome, Mail, Lock, User, Building2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isClubOwner, setIsClubOwner] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showResendEmail, setShowResendEmail] = useState(false);

  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/courts`,
        },
      });
    } catch (err) {
      setError('Erro ao fazer login com Google');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccessMessage('');
      setLoading(true);

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/courts`,
          },
        });

        if (error) throw error;

        // Check if email confirmation is required
        if (data.user && !data.session) {
          // Email confirmation is required
          setSuccessMessage('Conta criada! Verifique seu email para confirmar o cadastro antes de fazer login.');
          setEmail('');
          setPassword('');
          setFullName('');
          setClubName('');
          setClubDescription('');
          setIsSignUp(false); // Switch back to login mode
          return;
        }

        // If we have a session, create profile and redirect
        if (data.user && data.session) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: fullName,
            user_role: isClubOwner ? 'club_owner' : 'user',
            club_name: isClubOwner ? clubName : null,
            club_description: isClubOwner ? clubDescription : null,
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Don't throw error, profile might already exist
          }

          router.push(isClubOwner ? '/owner/dashboard' : '/courts');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
          // Better error messages
          if (error.message.includes('Email not confirmed')) {
            setShowResendEmail(true);
            throw new Error('Email não confirmado. Verifique sua caixa de entrada e confirme seu email antes de fazer login.');
          }
          throw error;
        }
        
        setShowResendEmail(false);

        // Create profile if it doesn't exist
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!existingProfile) {
          // Create a basic profile if it doesn't exist
          await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: data.user.email?.split('@')[0] || 'Usuário',
            user_role: 'user',
          });
        }

        const profile = existingProfile || { user_role: 'user' };
        router.push(profile?.user_role === 'club_owner' ? '/owner/dashboard' : '/courts');
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      setError('');
      setLoading(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      setSuccessMessage('Email de confirmação reenviado! Verifique sua caixa de entrada.');
      setShowResendEmail(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao reenviar email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
            <span className="text-3xl">🏟️</span>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            QuadraJá
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isClubOwner ? 'Gerencie suas quadras' : 'Reserve sua quadra em segundos'}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
          {isSignUp && (
            <div className="mb-6">
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsClubOwner(false)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                    !isClubOwner
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Usuário
                </button>
                <button
                  type="button"
                  onClick={() => setIsClubOwner(true)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                    isClubOwner
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Dono de Clube
                </button>
              </div>
            </div>
          )}

          {!isSignUp && (
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-3.5 px-6 rounded-xl border border-slate-200 dark:border-slate-600 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md mb-6"
            >
              <Chrome className="w-5 h-5" />
              Continuar com Google
            </button>
          )}

          {!isSignUp && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                  ou
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nome completo"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                  />
                </div>
              </div>
            )}

            {isSignUp && isClubOwner && (
              <>
                <div>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                      placeholder="Nome do clube"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <textarea
                    value={clubDescription}
                    onChange={(e) => setClubDescription(e.target.value)}
                    placeholder="Descrição do clube (opcional)"
                    rows={3}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all resize-none"
                  />
                </div>
              </>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl space-y-2">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                {showResendEmail && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    className="w-full text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium underline"
                  >
                    Reenviar email de confirmação
                  </button>
                )}
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
                <p className="text-emerald-600 dark:text-emerald-400 text-sm text-center font-medium">{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              {loading ? 'Carregando...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setIsClubOwner(false);
              }}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              {isSignUp
                ? 'Já tem uma conta? Entrar'
                : 'Não tem conta? Criar agora'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/courts"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              ← Voltar para explorar quadras
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
