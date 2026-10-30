'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalConfig,
    closeAuthModal,
    signInWithGoogle,
    signInWithOtp,
    signInDemo,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await signInWithOtp(email);
      setMessage('Sign-in link sent! Please check your email inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send sign-in link.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    signInDemo('Wedding Host', 'host@dawatnama.studio');
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-md animate-in fade-in duration-200">
      <div id="auth-modal-card" className="w-full max-w-md bg-paper border border-sand-300 rounded-[36px] p-6 sm:p-9 shadow-2xl relative text-espresso overflow-hidden">
        {/* Subtle decorative gold ambient tone */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-[60px] pointer-events-none" />

        {/* Close Button */}
        <button
          id="auth-close-btn"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-espresso/60 hover:text-espresso hover:bg-sand-100 transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 pt-2">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-sand-100 to-sand-200 border border-sand-300 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Sparkles className="w-6 h-6 text-gold-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gold-500 ring-2 ring-paper" />
          </div>
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-olive font-semibold block mb-1">
            Host Sanctuary Key
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-espresso mb-2">
            {authModalConfig.title}
          </h2>
          <p className="font-sans text-xs text-espresso/70 leading-relaxed max-w-xs mx-auto">
            {authModalConfig.description}
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* 1-Click Google Sign-In */}
        <div className="space-y-3 mb-6">
          <button
            id="auth-google-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full border border-sand-300 bg-white hover:bg-sand-50 text-espresso font-sans text-xs font-semibold shadow-xs hover:shadow transition-all active:scale-98 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-[1px] flex-grow bg-sand-300/80" />
          <span className="font-sans text-[10px] uppercase tracking-widest text-espresso/50">
            or with email link
          </span>
          <div className="h-[1px] flex-grow bg-sand-300/80" />
        </div>

        {/* Email Magic Link Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-espresso/70 mb-1.5 font-semibold">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-espresso/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso text-xs focus:outline-none focus:border-espresso transition-colors"
              />
            </div>
          </div>

          <button
            id="auth-email-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer ring-1 ring-gold-500/20"
          >
            <span>Send Instant Login Link</span>
            <ArrowRight className="w-3.5 h-3.5 text-sand-300" />
          </button>
        </form>

        {/* Quick Testing Demo Host Shortcut */}
        <div className="mt-5 pt-4 border-t border-sand-200 text-center">
          <button
            id="auth-demo-host-btn"
            type="button"
            onClick={handleQuickDemo}
            className="text-[11px] text-olive hover:text-espresso font-semibold underline underline-offset-4 transition-colors cursor-pointer"
          >
            ⚡ Instant Host Demo Sign-In (Local Preview)
          </button>
        </div>

        {/* Trust Note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-espresso/60 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-olive" />
          <span>Strictly private • Your invitations remain completely confidential.</span>
        </div>
      </div>
    </div>
  );
}
