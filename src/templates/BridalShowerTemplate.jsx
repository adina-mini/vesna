'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Clock,
  MapPin,
  CalendarPlus,
  Navigation,
  CheckCircle2,
  X,
  Gift,
  GlassWater,
  Camera
} from 'lucide-react';
import { submitRsvp } from '@/lib/supabase';
import IntroGate from '../components/IntroGate';

export default function BridalShowerTemplate({ data, isSample = false, invitationId, suppressIntro = false }) {
  const brideName = data?.bride_name || "Zoya Tariq";
  const groomName = data?.groom_name || "Farhan Malik";
  const eventTitle = data?.event_title || "The Bridal Soirée";
  const eventSubtitle = data?.event_subtitle || "An Intimate Evening of Glamour, Toasts & Celebrating the Bride-to-Be";
  const dedication = data?.dedication || "A Toast to Love, Laughter & Happily Ever After • Bride to Be";

  const eventDateIso = data?.event_date_iso || "2026-11-01T17:00:00";
  const eventDateDisplay = data?.event_date_display || "Sunday • November 1, 2026";
  const eventTimeDisplay = data?.event_time_display || "Five O'Clock in the Evening";
  const cityDisplay = data?.city_display || "Lahore, Pakistan";
  const venueName = data?.venue_name || "The Glasshouse Rooftop & Lounge";
  const venueAddress = data?.venue_address || "Gulberg Galleria, Main Boulevard, Lahore, Pakistan";
  const venueMapUrl = data?.venue_map_url || "https://maps.google.com/?q=Gulberg+Galleria+Lahore";
  const hashtag = data?.hashtag || "#ZOYAISGETTINGMARRIED";

  const heroImage = data?.hero_image || "/assets/bridal-shower-hero.jpg";
  const introImage = data?.intro_image || "/assets/bridal-girl-golden-intro.jpg";
  const venueImage = data?.venue_image || "/assets/venue-hall.png";

  const schedule = data?.schedule || [
    { time: "05:00 PM", tag: "Arrival", title: "Sparkling Welcome & Bellini Bar", desc: "Coupe glasses with sparkling mocktails, gourmet hors d'oeuvres, and polaroid photo wall.", icon: "glass" },
    { time: "05:45 PM", tag: "Games", title: "Bridal Trivia & Keepsake Toasts", desc: "How well do you know the bride, advice capsule cards, and emotional speeches by bridesmaids.", icon: "sparkles", highlight: true },
    { time: "06:30 PM", tag: "Shower", title: "Gift Unwrapping & Blessing Circles", desc: "Opening beautiful gifts, hugs, laughter, and heartfelt sisterly blessings.", icon: "gift" },
    { time: "07:15 PM", tag: "Cake", title: "Artisan Cake Cutting & Golden Toast", desc: "Two-tiered floral vanilla bean cake cutting with a golden toast to the bride-to-be.", icon: "heart", highlight: true },
    { time: "08:00 PM", tag: "Dinner", title: "Intimate Candlelit Dinner & Soirée", desc: "Curated multi-course dinner banquet, dessert display, and celebrating late into the night.", icon: "utensils" },
  ];

  const showerHighlights = [
    { title: "Sparkling Mocktails", desc: "Curated artisan drinks served in vintage crystal coupes", icon: "🥂" },
    { title: "Bridal Polaroid Wall", desc: "Snap instant memories and leave signed messages", icon: "📸" },
    { title: "Love Letter Capsule", desc: "Handwritten wishes for the bride to read on her wedding day", icon: "💌" },
    { title: "Parisian Cake & Treats", desc: "Fresh macarons, delicate choux pastries, and tiered cake", icon: "🎂" },
  ];

  const dressCode = [
    { name: "All Black Glam", hex: "#0E1015" },
    { name: "Champagne Silk", hex: "#E8D8B0" },
    { name: "Pearl White", hex: "#FFFDF7" },
    { name: "Rose Gold", hex: "#C79185" },
  ];

  // Intro gate state
  const [introDismissed, setIntroDismissed] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', guests: '1', attendance: 'attending' });

  useEffect(() => {
    function calculateCountdown() {
      const target = new Date(eventDateIso).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      setTimeLeft({
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        minutes: String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        seconds: String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0'),
      });
    }

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eventDateIso]);

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${eventTitle} • Celebrating ${brideName}`);
    const details = encodeURIComponent(`You are invited to ${eventTitle} celebrating our bride-to-be ${brideName}. ${eventSubtitle}`);
    const location = encodeURIComponent(`${venueName}, ${venueAddress}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`, '_blank');
  };

  return (
    <div className="bg-[#08090C] text-[#FAF5EF] antialiased font-serif min-h-screen overflow-x-hidden relative selection:bg-[#D4AF37]/30 selection:text-[#FFF5E6]">

      {/* Intro Gate (when not suppressed) */}
      {!suppressIntro && !introDismissed && (
        <IntroGate
          artwork={introImage}
          title={brideName}
          subtitle={eventTitle}
          onFinish={() => setIntroDismissed(true)}
          palette={['#08090C', '#14161D', '#D4AF37']}
        />
      )}

      {/* Sample Banner */}
      {isSample && (
        <div className="sticky top-0 z-40 bg-[#14161D]/90 backdrop-blur-md border-b border-[#D4AF37]/35 text-[#D4AF37] text-center py-2 px-4 text-xs font-sans tracking-widest uppercase">
          ✦ Sample Template Showcase &bull; Noir Glamour Bridal Shower &amp; Soirée
        </div>
      )}

      {/* Ambient Lighting Gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-gradient-to-b from-[#D4AF37]/15 via-[#1E232F]/20 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[#E8A0B4]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[130px] rounded-full" />
      </div>

      <main className="relative z-10 w-full min-h-screen py-0 sm:py-10 flex justify-center items-start">
        <div className="w-full sm:max-w-[480px] bg-gradient-to-b from-[#111319] via-[#0D0F14] to-[#08090C] text-[#FAF5EF] sm:rounded-[36px] shadow-[0_25px_90px_rgba(0,0,0,0.95)] border-0 sm:border border-[#D4AF37]/30 overflow-hidden relative">

          {/* PAGE 1: SPIRITUAL DEDICATION (BISMILLAH & SURAH AR-RUM 30:21) */}
          <section className="relative min-h-[92dvh] sm:min-h-[720px] flex flex-col justify-between items-center pt-10 pb-8 px-6 sm:px-8 text-center bg-gradient-to-b from-[#111319] via-[#0D0F14] to-[#08090C]">
            {/* Ornate Top Header Filigree */}
            <div className="flex items-center justify-center pt-2">
              <svg className="w-36 h-7 text-[#D4AF37] opacity-90" viewBox="0 0 160 30" fill="currentColor">
                <path d="M80,3 C65,3 55,18 40,18 C28,18 20,8 10,15 C5,18 2,25 0,28 C10,25 22,23 35,23 C50,23 60,10 80,10 C100,10 110,23 125,23 C138,23 150,25 160,28 C158,25 155,18 150,15 C140,8 132,18 120,18 C105,18 95,3 80,3 Z" opacity="0.85" />
              </svg>
            </div>

            <div className="my-auto py-2 w-full flex flex-col items-center">
              <p className="font-amiri text-lg sm:text-xl text-[#FAF5EF] font-normal tracking-wide mb-5 select-none">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              {/* Quranic Verse (Surah Ar-Rum 30:21) Card */}
              <div className="max-w-xs sm:max-w-sm mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#181B23] to-[#101218] border border-[#D4AF37]/50 shadow-sm relative">
                <div className="flex items-center justify-center -mt-8 mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#08090C] flex items-center justify-center border-2 border-[#181B23] shadow-sm">
                    <Sparkles className="w-4 h-4 fill-current text-[#08090C]" />
                  </span>
                </div>
                <p className="font-amiri text-base sm:text-lg text-[#FAF5EF] font-bold leading-relaxed mb-3" dir="rtl">
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
                </p>
                <div className="w-12 h-px bg-[#D4AF37]/60 mx-auto my-3" />
                <blockquote className="font-cormorant italic text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                  &ldquo;And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them, and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.&rdquo;
                </blockquote>
                <span className="inline-block mt-2.5 font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] font-bold">
                  (Surah Ar-Rum 30:21)
                </span>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="pb-2 flex flex-col items-center justify-center opacity-75">
              <span className="text-[10px] font-cinzel tracking-[0.25em] uppercase text-[#D4AF37] mb-1.5 font-semibold">
                Scroll to View Invitation ♡
              </span>
              <div className="w-5 h-8 rounded-full border border-[#D4AF37] flex items-start justify-center p-1">
                <span className="w-1.5 h-2.5 bg-[#D4AF37] rounded-full animate-bounce" />
              </div>
            </div>
          </section>

          {/* Top Elegant Ribbon Accent */}
          <div className="pt-8 pb-3 px-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/35 bg-[#181B23]/80 backdrop-blur-md text-[#D4AF37] text-[11px] tracking-[0.25em] uppercase font-sans font-semibold mb-3 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              BRIDE TO BE • CELEBRATION
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>

            <p className="text-xs md:text-sm text-[#D4AF37]/90 tracking-wide font-serif italic mt-1 font-medium">
              {dedication}
            </p>
          </div>

          {/* Hero Artwork with Sleek French Editorial Arch */}
          <div className="px-5 py-2">
            <div className="relative w-64 sm:w-72 mx-auto rounded-t-full rounded-b-3xl border-2 border-[#D4AF37]/50 p-2 shadow-2xl bg-gradient-to-b from-[#181B23] via-[#101218] to-[#08090C]">
              <div className="w-full aspect-[3/4] rounded-t-full rounded-b-2xl overflow-hidden relative shadow-inner bg-[#08090C]">
                <img
                  src={heroImage}
                  alt="Bride to Be in Black Saree"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-t-full rounded-b-2xl ring-1 ring-inset ring-[#D4AF37]/35 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090C]/80 via-transparent to-transparent opacity-70 pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-sans text-[#FAF5EF] tracking-wider uppercase bg-[#14161D]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4AF37]/30 shadow-md">
                  <span className="flex items-center gap-1.5 font-medium text-[#D4AF37]">
                    <Heart className="w-3 h-3 text-[#E8A0B4]" />
                    Future Mrs.
                  </span>
                  <span className="text-[#A4B3C6] text-[9px]">Ladies Soirée</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-bold">
                  Elegance &bull; Glamour &bull; Toasts
                </span>
              </div>
            </div>
          </div>

          {/* Title & Bride Name */}
          <div className="text-center px-6 pt-5 pb-6">
            <div className="inline-block text-[11px] font-sans tracking-[0.3em] uppercase text-[#D4AF37] font-semibold mb-1">
              Honor of the Bride
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#FAF5EF] tracking-tight font-normal leading-tight">
              {eventTitle}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#C9A84C] tracking-wide font-sans">
              {eventSubtitle}
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
              <div className="text-xl sm:text-2xl font-serif text-[#FAF5EF] tracking-wider font-medium">
                {brideName}
              </div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
            </div>

            {hashtag && (
              <div className="mt-2 text-[10px] font-sans tracking-[0.25em] uppercase text-[#A4B3C6]/70 font-medium">
                {hashtag}
              </div>
            )}
          </div>

          {/* Countdown Timer */}
          <div className="mx-5 mb-6 p-4 rounded-2xl bg-gradient-to-b from-[#181B23]/90 to-[#0F1117] border border-[#D4AF37]/25 text-center font-sans shadow-md">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 font-semibold flex items-center justify-center gap-1.5">
              <Clock className="w-3 h-3 text-[#D4AF37]" />
              Countdown to the Soirée
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 rounded-xl bg-[#090A0E] border border-[#D4AF37]/20 shadow-xs">
                <div className="text-xl sm:text-2xl font-serif text-[#FAF5EF] font-bold">{timeLeft.days}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#A4B3C6]">Days</div>
              </div>
              <div className="p-2 rounded-xl bg-[#090A0E] border border-[#D4AF37]/20 shadow-xs">
                <div className="text-xl sm:text-2xl font-serif text-[#FAF5EF] font-bold">{timeLeft.hours}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#A4B3C6]">Hours</div>
              </div>
              <div className="p-2 rounded-xl bg-[#090A0E] border border-[#D4AF37]/20 shadow-xs">
                <div className="text-xl sm:text-2xl font-serif text-[#FAF5EF] font-bold">{timeLeft.minutes}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#A4B3C6]">Mins</div>
              </div>
              <div className="p-2 rounded-xl bg-[#090A0E] border border-[#D4AF37]/20 shadow-xs">
                <div className="text-xl sm:text-2xl font-serif text-[#FAF5EF] font-bold">{timeLeft.seconds}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#A4B3C6]">Secs</div>
              </div>
            </div>
          </div>

          {/* Date & Venue Cards */}
          <div className="px-5 space-y-3 mb-6 font-sans">
            <div className="p-4 rounded-2xl bg-[#14161D]/80 border border-[#D4AF37]/20 flex items-start gap-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#090A0E] border border-[#D4AF37]/30 text-[#D4AF37] shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">Date &amp; Time</div>
                <div className="text-sm font-serif font-medium text-[#FAF5EF] mt-0.5">{eventDateDisplay}</div>
                <div className="text-xs text-[#C9A84C] mt-0.5 font-medium">{eventTimeDisplay}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#14161D]/80 border border-[#D4AF37]/20 flex items-start gap-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#090A0E] border border-[#D4AF37]/30 text-[#D4AF37] shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">Venue &amp; Lounge</div>
                <div className="text-sm font-serif font-medium text-[#FAF5EF] mt-0.5">{venueName}</div>
                <div className="text-xs text-[#A4B3C6] mt-0.5 leading-relaxed">{venueAddress}</div>
                <div className="mt-2.5 flex items-center gap-3">
                  <a
                    href={venueMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-medium"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Open Google Maps
                  </a>
                  <button
                    onClick={handleAddToCalendar}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] hover:underline font-medium"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Soirée Highlights */}
          <div className="mx-5 mb-6 p-4 rounded-2xl bg-gradient-to-b from-[#181B23]/90 to-[#0F1117] border border-[#D4AF37]/25 font-sans shadow-md">
            <div className="text-center mb-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Evening Highlights
              </div>
              <h4 className="text-sm font-serif text-[#FAF5EF] font-medium mt-0.5">
                Curated Moments &amp; Merriment
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {showerHighlights.map((h, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#090A0E]/90 border border-[#D4AF37]/15">
                  <div className="text-base mb-1">{h.icon}</div>
                  <div className="text-xs font-serif font-bold text-[#FAF5EF]">{h.title}</div>
                  <div className="text-[10px] text-[#A4B3C6] mt-0.5 leading-tight">{h.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="px-5 mb-6 font-sans">
            <div className="text-center mb-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Itinerary
              </div>
              <h3 className="text-lg font-serif text-[#FAF5EF] font-medium mt-0.5">
                Soirée Timeline
              </h3>
            </div>

            <div className="space-y-2.5">
              {schedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.highlight
                      ? 'bg-gradient-to-r from-[#2B1B26]/50 via-[#181B23]/80 to-[#2B1B26]/50 border-[#D4AF37]/45 shadow-md'
                      : 'bg-[#14161D]/50 border-[#D4AF37]/15'
                  } flex items-start gap-3`}
                >
                  <div className="px-2 py-1 rounded-lg bg-[#090A0E] border border-[#D4AF37]/25 text-[11px] font-semibold text-[#D4AF37] shrink-0 mt-0.5">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-serif font-bold text-[#FAF5EF] flex items-center gap-1.5">
                      {item.title}
                      {item.highlight && (
                        <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35 uppercase tracking-wider font-semibold">
                          Highlight
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#A4B3C6] mt-0.5 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Code */}
          <div className="mx-5 mb-6 p-4 rounded-2xl bg-[#14161D]/60 border border-[#D4AF37]/20 text-center font-sans">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
              Dress Code Theme
            </div>
            <div className="text-xs font-serif text-[#FAF5EF] font-medium mb-2.5">
              Noir Glamour: Chic Black Sarees &amp; Dresses, Champagne Silk, Pearls &amp; Rose Gold
            </div>
            <div className="flex items-center justify-center gap-3">
              {dressCode.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="w-5 h-5 rounded-full border border-[#D4AF37]/40 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[9px] text-[#A4B3C6]">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Card */}
          <div className="mx-5 mb-8 p-5 rounded-3xl bg-gradient-to-b from-[#181B23] to-[#0B0C10] border border-[#D4AF37]/35 text-center font-sans shadow-xl">
            <h3 className="text-base font-serif text-[#FAF5EF] font-medium mb-1">Kindly Respond</h3>
            <p className="text-xs text-[#A4B3C6] mb-4">Please confirm your attendance so we may reserve your crystal coupe and dinner place setting.</p>

            {rsvpSubmitted ? (
              <div className="p-4 rounded-2xl bg-[#1E2E20]/60 border border-[#D4AF37]/40 text-[#FAF5EF] flex items-center justify-center gap-2 text-xs font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                Wonderful! Your presence has been confirmed.
              </div>
            ) : (
              <button
                onClick={() => setRsvpOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C5A059] text-[#08090C] font-semibold text-xs tracking-widest uppercase hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all"
              >
                RSVP for the Bridal Soirée
              </button>
            )}
          </div>

          {/* SECTION 7: SUNNAH DUA & FOOTER */}
          <footer className="pt-8 pb-10 px-6 sm:px-8 text-center bg-gradient-to-b from-[#111319] via-[#0D0F14] to-[#08090C] border-t border-[#D4AF37]/25">
            <div className="max-w-xs mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF5EF] font-bold mb-2">We Eagerly Await You!</h2>

              <div className="my-5 p-4 rounded-2xl bg-[#14161D]/90 border border-[#D4AF37]/45 shadow-sm text-center">
                <span className="inline-flex items-center gap-1.5 font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  A Sacred Prayer
                </span>
                <p className="font-amiri text-base sm:text-lg text-[#FAF5EF] font-bold leading-relaxed mb-2" dir="rtl">
                  بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                </p>
                <div className="w-10 h-0.5 bg-[#D4AF37]/50 mx-auto my-2" />
                <p className="font-cormorant italic text-sm sm:text-base text-[#E2E8F0] leading-relaxed font-medium">
                  &ldquo;May Allah bless this union, bind your hearts with lifelong affection and mercy, and make your home a sanctuary of peace.&rdquo;
                </p>
              </div>

              <p className="font-cormorant italic text-base text-[#D4AF37]/90 mb-2">
                With love, prayers &amp; eternal gratitude,
              </p>
              <p className="font-script text-4xl sm:text-5xl text-[#FAF5EF] mb-6">
                {brideName.split(' ')[0]}
              </p>

              <p className="text-[10px] font-cinzel tracking-[0.25em] text-[#D4AF37] uppercase font-semibold mb-4">
                {hashtag}
              </p>
            </div>
          </footer>

          {/* Footer */}
          <div className="text-center pb-8 pt-2 text-[#A4B3C6]/60 text-[10px] font-sans tracking-widest uppercase border-t border-[#D4AF37]/15 mx-6 font-medium">
            VESNA Luxury Digital Atelier • &copy; {new Date().getFullYear()}
          </div>

        </div>
      </main>

      {/* RSVP Modal */}
      {rsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#14161D] to-[#08090C] rounded-3xl border border-[#D4AF37]/40 p-6 text-[#FAF5EF] shadow-2xl">
            <button
              onClick={() => setRsvpOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#A4B3C6] hover:text-[#FAF5EF] rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {rsvpSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-2" />
                <h3 className="font-serif text-lg font-bold text-[#FAF5EF]">Thank You!</h3>
                <p className="text-xs text-[#A4B3C6] mt-1">We can't wait to toast to the bride together!</p>
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">RSVP</div>
                  <h3 className="font-serif text-lg text-[#FAF5EF] font-medium mt-0.5">{eventTitle}</h3>
                </div>

                <div>
                  <label className="block text-xs text-[#A4B3C6] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    placeholder="e.g. Maya Ali"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#090A0E] border border-[#D4AF37]/30 text-[#FAF5EF] placeholder-[#A4B3C6]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A4B3C6] mb-1">Number of Attending Guests</label>
                  <select
                    value={rsvpForm.guests}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#090A0E] border border-[#D4AF37]/30 text-[#FAF5EF] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="1">1 Guest (Solo)</option>
                    <option value="2">2 Guests (+1)</option>
                    <option value="3">3 Guests (Group of 3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#A4B3C6] mb-1">Attendance Confirmation</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, attendance: 'attending' })}
                      className={`py-2 rounded-xl text-xs font-medium border transition ${
                        rsvpForm.attendance === 'attending'
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#08090C] font-semibold'
                          : 'bg-[#090A0E] border-[#D4AF37]/20 text-[#A4B3C6]'
                      }`}
                    >
                      Attending with Joy
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, attendance: 'declining' })}
                      className={`py-2 rounded-xl text-xs font-medium border transition ${
                        rsvpForm.attendance === 'declining'
                          ? 'bg-[#3A141A] border-[#D4AF37]/50 text-[#FAF5EF]'
                          : 'bg-[#090A0E] border-[#D4AF37]/20 text-[#A4B3C6]'
                      }`}
                    >
                      Regretfully Decline
                    </button>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    setRsvpSubmitted(true);
                    try {
                      if (invitationId) {
                        await submitRsvp({
                          invitation_id: invitationId,
                          guest_name: rsvpForm.name || 'Honored Guest',
                          attendance: rsvpForm.attendance,
                          guest_count: parseInt(rsvpForm.guests) || 1,
                        });
                      }
                    } catch (err) {
                      console.error('RSVP submit error:', err);
                    }
                    setTimeout(() => {
                      setRsvpOpen(false);
                      setRsvpSubmitted(false);
                    }, 2500);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#08090C] text-xs font-semibold tracking-wider uppercase hover:brightness-110 shadow-lg mt-2"
                >
                  Submit Soirée RSVP
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

