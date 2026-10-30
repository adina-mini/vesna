'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Heart, Compass, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/invite/')) {
    return null;
  }

  return (
    <footer className="bg-sand-100/90 border-t border-sand-300/80 text-espresso/80 pt-16 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-sand-300/70">
        {/* Brand & Manifesto */}
        <div className="md:col-span-5 space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sand-100 to-sand-200 border border-sand-300 flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4 text-olive" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-espresso tracking-[0.18em] block leading-tight">
                DAWATNAMA
              </span>
              <span className="text-[9px] font-sans uppercase tracking-[0.22em] text-olive font-semibold block">
                Luxury Digital Atelier
              </span>
            </div>
          </div>

          <p className="font-sans text-xs sm:text-sm text-espresso/70 max-w-sm leading-relaxed">
            Crafting animated, bespoke digital invitations for Pakistan’s most cherished celebrations — with Quranic calligraphy, live countdowns, Google Maps navigation, and 1-click WhatsApp delivery.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper/80 border border-sand-300/80 text-[11px] font-sans text-olive">
            <ShieldCheck className="w-3.5 h-3.5 text-olive" />
            <span>Strictly Private &amp; Ad-Free Guest Experience</span>
          </div>
        </div>

        {/* Suites & Navigation Links */}
        <div className="md:col-span-3 space-y-3 text-center md:text-left">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-olive font-semibold block">
            Atelier Suites
          </span>
          <ul className="space-y-2 text-xs font-sans text-espresso/75">
            <li>
              <Link href="/templates" className="hover:text-espresso transition-colors">
                Royal Wedding Suites (Barat &amp; Walima)
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-espresso transition-colors">
                Festive Mehndi &amp; Mayun Ubtan
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-espresso transition-colors">
                Sufi Qawwali &amp; Samaa Nights
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-espresso transition-colors">
                Milestones, Birthdays &amp; Anniversaries
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Studio Tools */}
        <div className="md:col-span-4 space-y-3 text-center md:text-left">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-olive font-semibold block">
            Studio Navigation
          </span>
          <ul className="space-y-2 text-xs font-sans text-espresso/75">
            <li>
              <Link href="/create" className="hover:text-espresso transition-colors">
                Customization Studio (Design from Scratch)
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-espresso transition-colors">
                Host Dashboard &amp; Live RSVP Headcount
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-espresso transition-colors">
                All 15 Handcrafted Suites Directory
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-sans text-espresso/60">
        <p>
          Designed for unforgettable life celebrations across Karachi, Lahore, Islamabad, London, Dubai &amp; worldwide.
        </p>
        <p className="uppercase tracking-widest text-[10px]">
          © {new Date().getFullYear()} Dawatnama Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
