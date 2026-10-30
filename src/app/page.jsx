'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HeroMockup from '@/components/HeroMockup';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  Share2,
  Layers,
  Smartphone,
  Music,
  Send,
  CheckCircle2,
  Volume2,
  ShieldCheck,
  Heart,
  ChevronRight,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const [activeExperienceTab, setActiveExperienceTab] = useState('rsvp');

  const celebrationEvents = [
    'Nikkah Ceremonies',
    'Royal Barat',
    'Walima Receptions',
    'Festive Mehndis',
    'Mayun & Ubtan',
    'Sufi Qawwali Nights',
    'Bridal Showers',
    'Milestone Birthdays',
    'Golden Anniversaries',
    'Aqiqah Celebrations',
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION - Modern Editorial Atelier Entrance                         */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 text-center bg-ivory">
        {/* Subtle ambient radial glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-b from-sand-200/50 via-gold-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Eyebrow Atelier Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-paper/90 backdrop-blur-md border border-sand-300 text-olive text-xs font-sans uppercase tracking-[0.25em] font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
            <span>Digital Invitation Atelier</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-espresso font-normal tracking-tight leading-[1.12] mb-6">
            Digital Invitations for Life’s{' '}
            <span className="italic font-serif text-burgundy font-normal">Most Cherished</span> Celebrations
          </h1>

          {/* High-legibility subheadline */}
          <p className="font-sans text-base sm:text-lg text-espresso/80 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            From regal Nikkah ceremonies and festive Mehndis to joyous birthdays, anniversaries, and intimate dinner galas. Create personalized, animated digital keepsakes with live countdowns, Google Maps navigation, and 1-click WhatsApp sharing.
          </p>

          {/* Editorial CTA Pair */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs uppercase tracking-wider font-semibold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 ring-1 ring-gold-500/30"
            >
              <span>Design Your Invitation</span>
              <ArrowRight className="w-4 h-4 text-sand-300" />
            </Link>

            <Link
              href="/templates"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-paper hover:bg-sand-100 border border-sand-300 text-espresso font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-sm"
            >
              <Layers className="w-4 h-4 text-olive" />
              <span>Browse All 15 Suites</span>
            </Link>
          </div>

          {/* Luxury Interactive Phone Mockup Preview */}
          <HeroMockup />

          {/* Value Badges in subtle Paper White cards */}
          <div className="mt-14 pt-8 border-t border-sand-300/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-3xl bg-paper/90 backdrop-blur-md border border-sand-300/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-sand-100 flex items-center justify-center mb-2.5">
                <Smartphone className="w-4 h-4 text-olive" />
              </div>
              <span className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">No App Needed</span>
              <span className="text-[11px] text-espresso/65 font-sans mt-0.5">Opens instantly in browser</span>
            </div>

            <div className="p-4 rounded-3xl bg-paper/90 backdrop-blur-md border border-sand-300/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-sand-100 flex items-center justify-center mb-2.5">
                <Calendar className="w-4 h-4 text-olive" />
              </div>
              <span className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">Live Countdown</span>
              <span className="text-[11px] text-espresso/65 font-sans mt-0.5">Real-time celebration clock</span>
            </div>

            <div className="p-4 rounded-3xl bg-paper/90 backdrop-blur-md border border-sand-300/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-sand-100 flex items-center justify-center mb-2.5">
                <MapPin className="w-4 h-4 text-olive" />
              </div>
              <span className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">Google Maps</span>
              <span className="text-[11px] text-espresso/65 font-sans mt-0.5">Turn-by-turn directions</span>
            </div>

            <div className="p-4 rounded-3xl bg-paper/90 backdrop-blur-md border border-sand-300/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-sand-100 flex items-center justify-center mb-2.5">
                <Share2 className="w-4 h-4 text-olive" />
              </div>
              <span className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">WhatsApp Delivery</span>
              <span className="text-[11px] text-espresso/65 font-sans mt-0.5">Direct personalized links</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CURATED CELEBRATIONS MARQUEE BANNER                                    */}
      {/* ========================================================================= */}
      <section className="py-5 bg-sand-200/60 border-y border-sand-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center flex-wrap gap-x-6 gap-y-2 text-xs font-sans uppercase tracking-[0.2em] text-espresso/75">
          {celebrationEvents.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="font-medium hover:text-espresso transition-colors">
                {item}
              </span>
              {idx !== celebrationEvents.length - 1 && (
                <span className="text-gold-500 font-serif">✦</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS - Refined 3-Step Editorial Workflow                       */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-ivory">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-sans text-xs tracking-[0.25em] uppercase text-olive font-semibold block mb-2">
              Simple &amp; Bespoke
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-espresso">
              How Dawatnama Works
            </h2>
            <p className="font-sans text-sm sm:text-base text-espresso/70 max-w-xl mx-auto mt-3 leading-relaxed">
              Crafting a regal digital invitation requires no design skills and takes under 3 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-paper border border-sand-300/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sand-100 text-espresso border border-sand-300 flex items-center justify-center mb-6 font-serif font-bold text-lg shadow-2xs group-hover:border-olive group-hover:bg-olive group-hover:text-paper transition-all">
                  1
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 group-hover:text-burgundy transition-colors">
                  Choose Your Design
                </h3>
                <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed mb-6">
                  Select a handcrafted template crafted specifically for your celebration — whether an ornate wedding ceremony, lively Mehndi, milestone birthday, or gala dinner.
                </p>
              </div>

              {/* Step 1 Visual Cue */}
              <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-[11px] font-sans text-espresso/60">
                <span>15 Exclusive Suites</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-burgundy shadow-2xs" />
                  <span className="w-3 h-3 rounded-full bg-gold-500 shadow-2xs" />
                  <span className="w-3 h-3 rounded-full bg-olive shadow-2xs" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-paper border border-sand-300/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sand-100 text-espresso border border-sand-300 flex items-center justify-center mb-6 font-serif font-bold text-lg shadow-2xs group-hover:border-olive group-hover:bg-olive group-hover:text-paper transition-all">
                  2
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 group-hover:text-burgundy transition-colors">
                  Personalize Details
                </h3>
                <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed mb-6">
                  Enter names, schedule itinerary, venue location with Google Maps integration, and upload your personal portrait photographs.
                </p>
              </div>

              {/* Step 2 Visual Cue */}
              <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-[11px] font-sans text-espresso/60">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-olive" />
                  Venue &amp; Timings
                </span>
                <span className="text-olive font-medium">Auto-Formatted</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-paper border border-sand-300/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sand-100 text-espresso border border-sand-300 flex items-center justify-center mb-6 font-serif font-bold text-lg shadow-2xs group-hover:border-olive group-hover:bg-olive group-hover:text-paper transition-all">
                  3
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 group-hover:text-burgundy transition-colors">
                  Publish &amp; Share
                </h3>
                <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed mb-6">
                  Generate an instant unique web link and send it seamlessly to family and guests via 1-click WhatsApp delivery with pre-formatted invitations.
                </p>
              </div>

              {/* Step 3 Visual Cue */}
              <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-[11px] font-sans text-espresso/60">
                <span className="flex items-center gap-1 text-green-700 font-medium">
                  <Share2 className="w-3 h-3 text-green-600" />
                  1-Click WhatsApp
                </span>
                <span className="font-mono text-[10px] bg-sand-100 px-2 py-0.5 rounded-full border border-sand-200">
                  Ready in seconds
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE GUEST EXPERIENCE SHOWCASE                                          */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-sand-100/70 border-t border-sand-300">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Phone Frame Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-[40px] bg-espresso p-4 shadow-2xl border-4 border-sand-300/80">
                <div className="rounded-[30px] bg-paper overflow-hidden border border-sand-200">
                  {/* Mock phone status bar */}
                  <div className="bg-sand-100 px-6 py-2 flex items-center justify-between text-[11px] font-sans text-espresso/60 border-b border-sand-200">
                    <span>9:41</span>
                    <span className="font-medium text-espresso/80">dawatnama.com</span>
                    <span>100%</span>
                  </div>

                  {/* Mock invitation content snippet */}
                  <div className="p-6 text-center space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-sand-100 text-olive text-[10px] font-sans uppercase tracking-widest font-semibold border border-sand-200">
                      Digital Invitation
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-espresso">
                      Fatima &amp; Sharjeel
                    </h4>
                    <p className="font-sans text-xs text-espresso/70">
                      Saturday &bull; November 7, 2026
                    </p>

                    {/* Mock Countdown Widget */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-sand-200">
                      <div className="bg-sand-100/70 p-2 rounded-xl">
                        <span className="font-serif text-lg font-bold text-espresso block">12</span>
                        <span className="text-[9px] uppercase tracking-wider text-espresso/60">Days</span>
                      </div>
                      <div className="bg-sand-100/70 p-2 rounded-xl">
                        <span className="font-serif text-lg font-bold text-espresso block">08</span>
                        <span className="text-[9px] uppercase tracking-wider text-espresso/60">Hours</span>
                      </div>
                      <div className="bg-sand-100/70 p-2 rounded-xl">
                        <span className="font-serif text-lg font-bold text-espresso block">45</span>
                        <span className="text-[9px] uppercase tracking-wider text-espresso/60">Mins</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="w-full py-2.5 rounded-xl bg-espresso text-paper text-xs font-sans font-medium flex items-center justify-center gap-1.5 shadow-2xs">
                        <MapPin className="w-3.5 h-3.5 text-sand-300" />
                        <span>Navigate to Venue</span>
                      </div>
                      <div className="w-full py-2 rounded-xl bg-sand-100 text-espresso text-xs font-sans font-medium flex items-center justify-center gap-1.5 border border-sand-200">
                        <Calendar className="w-3.5 h-3.5 text-olive" />
                        <span>Add to Calendar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="font-sans text-xs tracking-[0.25em] uppercase text-olive font-semibold block">
                The Guest Experience
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-espresso leading-tight">
                Designed for Instant Wonder on Any Smartphone
              </h2>
              <p className="font-sans text-sm sm:text-base text-espresso/75 leading-relaxed">
                Your guests don’t need to download apps, install software, or register accounts. Tapping your WhatsApp link opens a bespoke, interactive experience in their default mobile browser.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-paper/90 border border-sand-300/80 shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-sand-100 border border-sand-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Music className="w-4 h-4 text-olive" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-espresso">Ambient Music &amp; Motion</h4>
                    <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-0.5">
                      Subtle animations, interactive seal openings, and background melody create a memorable atmosphere.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-paper/90 border border-sand-300/80 shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-sand-100 border border-sand-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-olive" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-espresso">Direct Venue Navigation</h4>
                    <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-0.5">
                      Guests can tap once to launch Google Maps and get turn-by-turn directions straight to your hall or event venue.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-paper/90 border border-sand-300/80 shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-sand-100 border border-sand-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Send className="w-4 h-4 text-olive" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-espresso">Frictionless WhatsApp Sharing</h4>
                    <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-0.5">
                      Send personalized greeting links straight to family groups and friends with customized invitation cards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CALL TO ACTION BANNER                                                  */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 bg-ivory border-t border-sand-300 text-center relative overflow-hidden">
        {/* Ambient warm glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-gold-500/15 via-burgundy/15 to-transparent blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 p-8 sm:p-12 rounded-[36px] bg-paper/90 backdrop-blur-xl border border-sand-300 shadow-atelier">
          <div className="w-14 h-14 rounded-2xl bg-sand-100 border border-sand-300 flex items-center justify-center mx-auto mb-5 shadow-2xs">
            <Sparkles className="w-6 h-6 text-gold-600 animate-pulse" />
          </div>
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive font-semibold block mb-2">
            The Atelier Awaits
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-espresso mb-4">
            Begin Your Celebration Story
          </h2>
          <p className="font-sans text-sm sm:text-base text-espresso/75 mb-8 max-w-md mx-auto leading-relaxed">
            Create an invitation your guests will cherish, admire, and remember for years to come. Live in 3 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs uppercase tracking-wider font-semibold shadow-md hover:shadow-lg transition-all active:scale-98 ring-1 ring-gold-500/30"
            >
              <span>Start Customizing Now</span>
              <ArrowRight className="w-4 h-4 text-sand-300" />
            </Link>
            <Link
              href="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs uppercase tracking-wider font-semibold transition-all"
            >
              <span>Explore All Suites</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
