'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Layers,
  PlusCircle,
  BookmarkCheck,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import VesnaLogo from '@/components/VesnaLogo';
import { getPlatformSettings } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal, signOut } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [banner, setBanner] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    const s = getPlatformSettings();
    if (s && s.bannerActive && s.bannerMessage) {
      setBanner(s);
    }
  }, [pathname]);

  const isInvitePage = pathname?.startsWith('/invite/');

  // Don't clutter the clean immersive guest invitation view with the platform navbar
  if (isInvitePage) {
    return null;
  }

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Host';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  const navLinks = [
    { href: '/templates', label: 'Suites Directory', icon: Layers, badge: '15' },
    { href: '/create', label: 'Design Studio', icon: PlusCircle },
    { href: '/dashboard', label: 'Host Dashboard', icon: BookmarkCheck },
  ];

  return (
    <div className="sticky top-0 z-50">
      {/* Top Announcement Banner (Configured from /admin) */}
      {banner?.bannerActive && !bannerDismissed && (
        <div className="bg-[#1C1815] text-paper text-[11px] font-sans py-2 px-4 flex items-center justify-center gap-2 border-b border-gold-500/30 text-center relative shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 flex-shrink-0 animate-pulse" />
          <span className="tracking-wide text-sand-100">
            {banner.bannerMessage}
          </span>
          {banner.bannerLink && (
            <Link
              href={banner.bannerLink}
              className="underline text-gold-400 hover:text-gold-300 font-semibold ml-1.5 transition-colors"
            >
              Explore Now
            </Link>
          )}
          <button
            onClick={() => setBannerDismissed(true)}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 text-sand-300/60 hover:text-sand-100 p-1 cursor-pointer transition-colors"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="bg-paper/90 backdrop-blur-xl border-b border-sand-300/80 shadow-[0_4px_20px_-2px_rgba(69,53,47,0.04)] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo & Monogram */}
        <Link href="/" className="group flex items-center">
          <VesnaLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-sand-100/70 border border-sand-300/60 backdrop-blur-md">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-xs font-sans tracking-wide uppercase transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-espresso text-paper font-semibold shadow-xs'
                    : 'text-espresso/70 hover:text-espresso hover:bg-paper/70 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sand-300' : 'text-olive'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-paper/20 text-paper'
                        : 'bg-sand-200 text-espresso/80'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action & Auth Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {user ? (
            /* User Signed In Dropdown */
            <div className="relative">
              <button
                id="nav-user-dropdown-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-paper border border-sand-300 hover:border-olive hover:shadow-xs transition-all text-espresso text-xs font-medium cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-olive to-olive-dark text-paper flex items-center justify-center font-bold text-[11px] shadow-2xs">
                  {userInitial}
                </div>
                <span className="hidden sm:inline max-w-[110px] truncate font-sans text-xs">
                  {userDisplayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-espresso/60" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 rounded-3xl bg-paper border border-sand-300 shadow-xl py-2 z-50 text-espresso animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-sand-200 bg-sand-50/50 rounded-t-3xl">
                      <p className="font-serif text-xs font-bold text-espresso truncate">
                        {userDisplayName}
                      </p>
                      <p className="font-sans text-[11px] text-espresso/60 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      id="nav-dropdown-dashboard-link"
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-espresso hover:bg-sand-100 transition-colors font-medium"
                    >
                      <BookmarkCheck className="w-4 h-4 text-olive" />
                      <span>Host Dashboard & RSVPs</span>
                    </Link>

                    <Link
                      id="nav-dropdown-create-link"
                      href="/create"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-espresso hover:bg-sand-100 transition-colors font-medium"
                    >
                      <PlusCircle className="w-4 h-4 text-olive" />
                      <span>Design New Suite</span>
                    </Link>

                    <div className="border-t border-sand-200 my-1" />

                    <button
                      id="nav-signout-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-700 hover:bg-red-50 transition-colors font-medium text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* User Signed Out: Sign In Trigger */
            <button
              id="nav-signin-btn"
              onClick={() => openAuthModal({ title: 'Sign In to VESNA' })}
              className="px-4 py-2 rounded-full border border-sand-300 bg-paper hover:bg-sand-100 text-espresso font-sans text-xs font-medium transition-all hover:shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Primary Create Button with subtle gold border */}
          <Link
            id="nav-create-btn"
            href="/create"
            className="px-4 sm:px-5 py-2.5 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold tracking-wide shadow-xs hover:shadow-md transition-all active:scale-98 flex items-center gap-2 ring-1 ring-gold-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-sand-300" />
            <span className="hidden sm:inline">Create Invitation</span>
            <span className="sm:hidden">Create</span>
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-espresso hover:bg-sand-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sand-300 bg-paper/95 backdrop-blur-xl px-4 py-5 space-y-3 shadow-lg animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs uppercase tracking-wider font-sans transition-colors ${
                    isActive
                      ? 'bg-espresso text-paper font-semibold'
                      : 'text-espresso/80 hover:bg-sand-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sand-300' : 'text-olive'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sand-200 text-espresso font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {!user && (
            <div className="pt-3 border-t border-sand-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal({ title: 'Sign In to VESNA' });
                }}
                className="w-full py-2.5 rounded-2xl border border-sand-300 bg-sand-50 hover:bg-sand-100 text-espresso font-sans text-xs font-semibold uppercase tracking-wider text-center block"
              >
                Sign In to Host Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  </div>
  );
}
