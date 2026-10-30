'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  isAuthModalOpen: false,
  authModalConfig: { title: 'Sign In to VESNA', description: '', callback: null },
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInWithGoogle: async () => {},
  signInWithOtp: async () => {},
  signInWithPassword: async () => {},
  signUpWithPassword: async () => {},
  signInDemo: () => {},
  signOut: async () => {},
});

const DEMO_USER_KEY = 'shadii_demo_user_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({
    title: 'Sign In to VESNA',
    description: 'Save your digital invitations and track guest RSVPs from your private dashboard.',
    callback: null,
  });

  useEffect(() => {
    // 1. If Supabase is configured, listen to Supabase auth events
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // 2. Fallback local / demo session for local development
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(DEMO_USER_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            setUser(parsed);
          }
        } catch (e) {}
      }
      setLoading(false);
    }
  }, []);

  const openAuthModal = ({ title = 'Sign In to VESNA', description = '', callback = null } = {}) => {
    setAuthModalConfig({
      title: title || 'Sign In to VESNA',
      description: description || 'Save your digital invitations and track guest RSVPs from your private dashboard.',
      callback,
    });
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const triggerCallback = (authenticatedUser) => {
    if (authModalConfig.callback && typeof authModalConfig.callback === 'function') {
      try {
        authModalConfig.callback(authenticatedUser);
      } catch (err) {
        console.error('Auth callback error:', err);
      }
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
        },
      });
      if (error) throw error;
      return data;
    } else {
      // Local demo fallback
      const demoUser = {
        id: 'usr_google_demo_101',
        email: 'host@vesna.atelier',
        user_metadata: {
          full_name: 'Fatima & Sharjeel (Host)',
          avatar_url: '/assets/couple-golden-intro.jpg',
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      }
      setUser(demoUser);
      closeAuthModal();
      triggerCallback(demoUser);
      return { user: demoUser };
    }
  };

  // Sign in with Magic Link OTP
  const signInWithOtp = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
        },
      });
      if (error) throw error;
      return data;
    } else {
      // Local demo fallback
      const demoUser = {
        id: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email,
        user_metadata: {
          full_name: email.split('@')[0],
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      }
      setUser(demoUser);
      closeAuthModal();
      triggerCallback(demoUser);
      return { user: demoUser };
    }
  };

  // Sign in with Password
  const signInWithPassword = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      closeAuthModal();
      triggerCallback(data.user);
      return data;
    } else {
      return signInWithOtp(email);
    }
  };

  // Sign up with Password
  const signUpWithPassword = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setUser(data.user);
      closeAuthModal();
      triggerCallback(data.user);
      return data;
    } else {
      return signInWithOtp(email);
    }
  };

  // Quick Instant Host Demo Login
  const signInDemo = (name = 'Wedding Host', email = 'host@vesna.atelier') => {
    const demoUser = {
      id: 'usr_demo_host_888',
      email,
      user_metadata: {
        full_name: name,
      },
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    }
    setUser(demoUser);
    closeAuthModal();
    triggerCallback(demoUser);
  };

  // Sign out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY);
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthModalOpen,
        authModalConfig,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithOtp,
        signInWithPassword,
        signUpWithPassword,
        signInDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
