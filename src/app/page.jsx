'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  Share2,
  Layers,
  Smartphone,
  Music,
  Send
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION - Modern Editorial Studio Entrance                         */}
      {/* ========================================================================= */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-28 px-4 sm:px-6 text-center bg-ivory">
        {/* Subtle warm ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-sand-200/40 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Eyebrow Studio Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-paper border border-sand-300 text-olive text-xs font-sans uppercase tracking-[0.2em] font-medium mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-olive" />
            <span>Digital Invitation Atelier</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-espresso font-normal tracking-tight leading-[1.12] mb-6">
            Digital Invitations for Life’s{' '}
            <span className="italic font-serif text-burgundy font-normal">Most Cherished</span> Celebrations
          </h1>

          {/* High-legibility subheadline welcoming every celebration */}
          <p className="font-sans text-base sm:text-lg text-espresso/80 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            From regal Nikkah ceremonies and festive Mehndis to joyous birthdays, anniversaries, and intimate dinner galas. Create personalized, animated digital keepsakes with live countdowns, Google Maps navigation, and 1-click WhatsApp sharing.
          </p>

          {/* Editorial CTA Pair */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs uppercase tracking-wider font-semibold shadow-sm hover:shadow transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Create Your Invitation</span>
              <ArrowRight className="w-4 h-4 text-sand-300" />
            </Link>

            <Link
              href="/templates"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-paper hover:bg-sand-100 border border-sand-300 text-espresso font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-olive" />
              <span>Browse All Designs</span>
            </Link>
          </div>

          {/* Value Badges in subtle Paper White cards */}
          <div className="mt-16 pt-8 border-t border-sand-300/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-paper/80 border border-sand-300/70 shadow-xs flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center mb-2">
                <Smartphone className="w-4 h-4 text-olive" />
              </div>
              <span className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">No App Needed</span>
              <span className="text-[11px] text-espresso/65 font-sans mt-0.5">Opens instantly in browser</span>
            </div>

            <div className="p-4 rounded-2xl bg-paper/80 border border-sand-300/70 shadow-xs flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 text-olive" />
              </div>
              <span className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">Live Countdown</span>
              <span className="text-[11px] text-espresso/65 font-sans mt-0.5">Builds real-time excitement</span>
            </div>

            <div className="p-4 rounded-2xl bg-paper/80 border border-sand-300/70 shadow-xs flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center mb-2">
                <MapPin className="w-4 h-4 text-olive" />
              </div>
              <span className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">Google Maps</span>
              <span className="text-[11px] text-espresso/65 font-sans mt-0.5">One-click venue directions</span>
            </div>

            <div className="p-4 rounded-2xl bg-paper/80 border border-sand-300/70 shadow-xs flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center mb-2">
                <Share2 className="w-4 h-4 text-olive" />
              </div>
              <span className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">WhatsApp Delivery</span>
              <span className="text-[11px] text-espresso/65 font-sans mt-0.5">Direct personalized links</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HOW IT WORKS - Refined 3-Step Editorial Workflow                       */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-sand-100/60 border-y border-sand-300">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-sans text-xs tracking-[0.25em] uppercase text-olive font-semibold block mb-2">
              Simple &amp; Bespoke
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-espresso">
              How Dawatnama Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-paper border border-sand-300 shadow-xs text-center relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-sand-100 text-espresso border border-sand-300 flex items-center justify-center mx-auto mb-5 font-serif font-bold text-lg">
                  1
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3">Choose Your Design</h3>
                <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed">
                  Select a template crafted for your celebration — whether an ornate wedding ceremony, lively Mehndi, birthday bash, or dinner gala.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-paper border border-sand-300 shadow-xs text-center relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-sand-100 text-espresso border border-sand-300 flex items-center justify-center mx-auto mb-5 font-serif font-bold text-lg">
                  2
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3">Personalize Details</h3>
                <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed">
                  Enter names, schedule itinerary, venue location with Google Maps integration, and upload your personal portrait photographs.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-paper border border-sand-300 shadow-xs text-center relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-sand-100 text-espresso border border-sand-300 flex items-center justify-center mx-auto mb-5 font-serif font-bold text-lg">
                  3
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3">Publish &amp; Share</h3>
                <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed">
                  Generate an instant unique web link and send it seamlessly to family and guests via 1-click WhatsApp delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE GUEST EXPERIENCE SHOWCASE                                          */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-sand-100/70 border-t border-sand-300">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Phone Frame Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-[36px] bg-espresso p-4 shadow-xl border-4 border-sand-300/80">
                <div className="rounded-[28px] bg-paper overflow-hidden border border-sand-200">
                  {/* Mock phone status bar */}
                  <div className="bg-sand-100 px-6 py-2 flex items-center justify-between text-[11px] font-sans text-espresso/60 border-b border-sand-200">
                    <span>9:41</span>
                    <span className="font-medium text-espresso/80">dawatnama.com</span>
                    <span>100%</span>
                  </div>

                  {/* Mock invitation content snippet */}
                  <div className="p-6 text-center space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-sand-100 text-olive text-[10px] font-sans uppercase tracking-widest font-semibold">
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
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-paper border border-sand-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Music className="w-4 h-4 text-olive" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-espresso">Ambient Music &amp; Motion</h4>
                    <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-0.5">
                      Subtle animations, interactive seal openings, and background melody create a memorable atmosphere.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-paper border border-sand-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-olive" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-espresso">Direct Venue Navigation</h4>
                    <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-0.5">
                      Guests can tap once to launch Google Maps and get turn-by-turn directions straight to your hall or event venue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-paper border border-sand-300 flex items-center justify-center flex-shrink-0 mt-0.5">
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
      {/* 4. CALL TO ACTION BANNER                                                  */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 bg-ivory border-t border-sand-300 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-sand-100 border border-sand-300 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-olive" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-espresso mb-4">
            Begin Your Celebration Story
          </h2>
          <p className="font-sans text-sm sm:text-base text-espresso/75 mb-8 max-w-md mx-auto leading-relaxed">
            Create an invitation your guests will cherish, admire, and remember for years to come.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs uppercase tracking-wider font-semibold shadow-sm hover:shadow transition-all active:scale-98"
          >
            <span>Start Customizing Now</span>
            <ArrowRight className="w-4 h-4 text-sand-300" />
          </Link>
        </div>
      </section>
    </div>
  );
}
