'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Music,
  Clock,
  MapPin,
  CalendarPlus,
  Navigation,
  Heart,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Share2,
  Flame,
  Moon
} from 'lucide-react';
import { submitRsvp } from '@/lib/supabase';
import IntroGate from '../components/IntroGate';

export default function QawwaliTemplate({ data, isSample = false, invitationId, suppressIntro = false }) {
  const brideName = data?.bride_name || "Fatima Hafeez";
  const groomName = data?.groom_name || "Rao Sharjeel";
  const coupleName = data?.couple_names || `${brideName} & ${groomName}`;
  const coupleInitials = data?.couple_initials || "F & S";
  const eventTitle = data?.event_title || "Mehfil-e-Qawwali";
  const eventSubtitle = data?.event_subtitle || "An Enchanting Evening of Sufiana Kalam, Ghazal & Sacred Music";
  const sufiDedication = data?.sufi_dedication || "بزمِ سماع و سرورِ عشق • In celebration of timeless love, devotion & melody";
  
  const eventDateIso = data?.event_date_iso || "2026-11-06T20:00:00";
  const eventDateDisplay = data?.event_date_display || "Friday • November 6, 2026";
  const eventTimeDisplay = data?.event_time_display || "Eight O'Clock in the Evening";
  const cityDisplay = data?.city_display || "Lahore, Pakistan";
  const venueName = data?.venue_name || "Haveli Barood Khana • Royal Courtyard";
  const venueAddress = data?.venue_address || "Fort Road, Walled City of Lahore, Punjab, Pakistan";
  const venueMapUrl = data?.venue_map_url || "https://maps.google.com/?q=Haveli+Barood+Khana+Lahore";
  const hashtag = data?.hashtag || "#FATIMAANDSHARJEEL2026";

  const heroImage = data?.hero_image || "/assets/qawwali-hero.jpg";
  const introImage = data?.intro_image || "/assets/couple-golden-intro.jpg";
  const venueImage = data?.venue_image || "/assets/venue-hall.png";

  const schedule = data?.schedule || [
    { time: "08:00 PM", tag: "Istaqbaal", title: "Dawat-e-Istaqbaal", desc: "Welcome refreshments, saffron Kashmiri chai, warm bakhoor fragrance and floral ittar.", icon: "users" },
    { time: "08:45 PM", tag: "Blessing", title: "Hamd-o-Naat & Candle Lighting", desc: "Opening sacred verses, lighting of antique brass lanterns, and prayers of barakah.", icon: "flame" },
    { time: "09:15 PM", tag: "Samaa", title: "Mehfil-e-Samaa • Live Ensemble", desc: "Traditional Sufiana Kalam, soulful harmonium, and rhythmic tabla poetry.", icon: "music", highlight: true },
    { time: "10:45 PM", tag: "Dawat", title: "Royal Shahi Dawat", desc: "Authentic royal feast: Dum pukht biryani, mutton galouti kebabs, and warm rabri jalebi.", icon: "utensils" },
    { time: "11:45 PM", tag: "Rang", title: "Amir Khusro Rang • Grand Finale", desc: "The ecstatic traditional Rang finale, singing together and shower of rose petals.", icon: "sparkles", highlight: true },
  ];

  const kalamRepertoire = data?.kalam_repertoire || [
    { title: "Tajdar-e-Haram", poet: "Sabri Heritage", mood: "Spiritual Ecstasy" },
    { title: "Chhap Tilak Sab Chheeni", poet: "Hazrat Amir Khusro", mood: "Divine Devotion" },
    { title: "Dam Mast Qalandar", poet: "Lal Shahbaz Qalandar", mood: "Sacred Trance" },
    { title: "Afreen Afreen", poet: "Javed Akhtar / NFAK", mood: "Timeless Ghazal" },
    { title: "Mera Piya Ghar Aaya", poet: "Hazrat Baba Bulleh Shah", mood: "Celebratory Rang" },
  ];

  const dressCode = [
    { name: "Midnight Velvet", hex: "#0E182A" },
    { name: "Forest Emerald", hex: "#0F3826" },
    { name: "Antique Gold", hex: "#D4AF37" },
    { name: "Ivory Silk", hex: "#FAF5EF" },
  ];

  // Intro gate state
  const [introDismissed, setIntroDismissed] = useState(false);
  const [introActive, setIntroActive] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', guests: '2', attendance: 'attending', notes: '' });
  const [isMuted, setIsMuted] = useState(true);

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
    const title = encodeURIComponent(`${eventTitle} • ${coupleName}`);
    const details = encodeURIComponent(`You are cordially invited to ${eventTitle} celebrating ${coupleName}. ${eventSubtitle}`);
    const location = encodeURIComponent(`${venueName}, ${venueAddress}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`, '_blank');
  };

  return (
    <div className="bg-[#050A14] text-[#FAF5EF] antialiased font-serif min-h-screen overflow-x-hidden relative selection:bg-[#D4AF37]/30 selection:text-[#FFF5E6]">

      {/* Intro Gate (when not suppressed) */}
      {!suppressIntro && !introDismissed && (
        <IntroGate
          artwork={introImage}
          title={coupleName}
          subtitle={eventTitle}
          onFinish={() => setIntroDismissed(true)}
          palette={['#050A14', '#0F3826', '#D4AF37']}
        />
      )}

      {/* Sample Banner */}
      {isSample && (
        <div className="sticky top-0 z-40 bg-[#0E182A]/90 backdrop-blur-md border-b border-[#D4AF37]/30 text-[#D4AF37] text-center py-2 px-4 text-xs font-sans tracking-widest uppercase">
          ✦ Sample Template Showcase &bull; Mehfil-e-Qawwali & Sufi Soirée
        </div>
      )}

      {/* Ambient Radial Lighting Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#0F3826]/30 via-[#0E182A]/30 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-[#D4AF37]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 -left-32 w-[550px] h-[550px] bg-[#781220]/15 blur-[130px] rounded-full" />
      </div>

      <main className="relative z-10 w-full min-h-screen py-0 sm:py-10 flex justify-center items-start">
        <div className="w-full sm:max-w-[480px] bg-gradient-to-b from-[#0A111F] via-[#070D18] to-[#040810] text-[#FAF5EF] sm:rounded-[36px] shadow-[0_25px_90px_rgba(0,0,0,0.9)] border-0 sm:border border-[#D4AF37]/35 overflow-hidden relative">

          {/* PAGE 1: SPIRITUAL DEDICATION (BISMILLAH & SURAH AR-RUM 30:21) */}
          <section className="relative min-h-[92dvh] sm:min-h-[720px] flex flex-col justify-between items-center pt-10 pb-8 px-6 sm:px-8 text-center bg-gradient-to-b from-[#0A111F] via-[#070D18] to-[#040810]">
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
              <div className="max-w-xs sm:max-w-sm mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0E182A] to-[#070D18] border border-[#D4AF37]/50 shadow-sm relative">
                <div className="flex items-center justify-center -mt-8 mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#050A14] flex items-center justify-center border-2 border-[#0E182A] shadow-sm">
                    <Sparkles className="w-4 h-4 fill-current text-[#050A14]" />
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

          {/* Golden Arched Top Filigree */}
          <div className="pt-8 pb-4 px-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#0E182A]/70 backdrop-blur-md text-[#D4AF37] text-[11px] tracking-[0.25em] uppercase font-sans mb-3">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            </div>
            
            <p className="text-xs md:text-sm text-[#D4AF37]/90 tracking-wide font-serif italic mt-1">
              {sufiDedication}
            </p>
          </div>

          {/* Hero Artwork with Grand Haveli Mehrab Arch */}
          <div className="px-5 py-2">
            <div className="relative w-64 sm:w-72 mx-auto rounded-t-full rounded-b-2xl border-2 border-[#D4AF37]/50 p-2 shadow-2xl bg-gradient-to-b from-[#0E182A] via-[#080E18] to-[#040810]">
              <div className="w-full aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden relative shadow-inner bg-[#03060C]">
                <img
                  src={heroImage}
                  alt="Mehfil-e-Qawwali Ensemble"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-t-full rounded-b-xl ring-1 ring-inset ring-[#D4AF37]/35 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A111F]/80 via-transparent to-transparent opacity-75 pointer-events-none" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-sans text-[#D4AF37] tracking-wider uppercase bg-[#070D18]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4AF37]/30 shadow-md">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Mehfil-e-Samaa
                  </span>
                  <span className="text-[#A4B3C6] text-[9px]">Live Ensemble</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-bold">
                  Sufiana Kalam &bull; Ghazal &bull; Rang
                </span>
              </div>
            </div>
          </div>

          {/* Event Title & Couple Identity */}
          <div className="text-center px-6 pt-5 pb-6">
            <div className="inline-block text-[11px] font-sans tracking-[0.3em] uppercase text-[#D4AF37] mb-1">
              Celebration of Love & Melody
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#FAF5EF] tracking-tight font-normal leading-tight">
              {eventTitle}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#C9A84C] tracking-wide font-sans">
              {eventSubtitle}
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
              <div className="text-lg sm:text-xl font-serif text-[#FAF5EF] tracking-wider font-medium">
                {coupleName}
              </div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
            </div>

            {hashtag && (
              <div className="mt-2 text-[10px] font-sans tracking-[0.25em] uppercase text-[#A4B3C6]/70">
                {hashtag}
              </div>
            )}
          </div>

          {/* Live Countdown Timer */}
          <div className="mx-5 mb-6 p-4 rounded-2xl bg-gradient-to-b from-[#0E182A]/70 to-[#070D18]/80 border border-[#D4AF37]/25 text-center font-sans">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 font-medium flex items-center justify-center gap-1.5">
              <Clock className="w-3 h-3" />
              The Countdown to the Mehfil
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 rounded-xl bg-[#040810]/80 border border-[#D4AF37]/20">
                <div className="text-xl sm:text-2xl font-serif text-[#FAF5EF] font-bold">{timeLeft.days}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#A4B3C6]">Days</div>
              </div>
              <div className="p-2 rounded-xl bg-[#040810]/80 border border-[#D4AF37]/20">
                <div className="text-xl sm:text-2xl font-serif text-[#FAF5EF] font-bold">{timeLeft.hours}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#A4B3C6]">Hours</div>
              </div>
              <div className="p-2 rounded-xl bg-[#040810]/80 border border-[#D4AF37]/20">
                <div className="text-xl sm:text-2xl font-serif text-[#FAF5EF] font-bold">{timeLeft.minutes}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#A4B3C6]">Mins</div>
              </div>
              <div className="p-2 rounded-xl bg-[#040810]/80 border border-[#D4AF37]/20">
                <div className="text-xl sm:text-2xl font-serif text-[#FAF5EF] font-bold">{timeLeft.seconds}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#A4B3C6]">Secs</div>
              </div>
            </div>
          </div>

          {/* Date & Venue Info Cards */}
          <div className="px-5 space-y-3 mb-6 font-sans">
            <div className="p-4 rounded-2xl bg-[#0E182A]/60 border border-[#D4AF37]/25 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#040810] border border-[#D4AF37]/30 text-[#D4AF37] shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">Date &amp; Time</div>
                <div className="text-sm font-serif font-medium text-[#FAF5EF] mt-0.5">{eventDateDisplay}</div>
                <div className="text-xs text-[#C9A84C] mt-0.5">{eventTimeDisplay}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E182A]/60 border border-[#D4AF37]/25 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#040810] border border-[#D4AF37]/30 text-[#D4AF37] shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">Venue &amp; Courtyard</div>
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

          {/* Mehfil Order of Evening (Timeline) */}
          <div className="px-5 mb-6 font-sans">
            <div className="text-center mb-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Order of the Evening
              </div>
              <h3 className="text-lg font-serif text-[#FAF5EF] font-medium mt-0.5">
                Program &amp; Samaa Schedule
              </h3>
            </div>

            <div className="space-y-2.5">
              {schedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.highlight
                      ? 'bg-gradient-to-r from-[#0F3826]/40 via-[#0E182A]/70 to-[#0F3826]/40 border-[#D4AF37]/45 shadow-lg'
                      : 'bg-[#0E182A]/40 border-[#D4AF37]/15'
                  } flex items-start gap-3`}
                >
                  <div className="px-2 py-1 rounded-lg bg-[#040810] border border-[#D4AF37]/25 text-[11px] font-semibold text-[#D4AF37] shrink-0 mt-0.5">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-serif font-bold text-[#FAF5EF] flex items-center gap-1.5">
                      {item.title}
                      {item.highlight && (
                        <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-wider">
                          Featured
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

          {/* Kalaam Repertoire Card */}
          <div className="mx-5 mb-6 p-4 rounded-2xl bg-gradient-to-b from-[#0E182A]/80 to-[#060B14] border border-[#D4AF37]/30 font-sans">
            <div className="text-center mb-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Sufiana Repertoire
              </div>
              <h4 className="text-sm font-serif text-[#FAF5EF] mt-0.5">
                Revered Kalaam &amp; Ghazals
              </h4>
            </div>

            <div className="space-y-2">
              {kalamRepertoire.map((k, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-xl bg-[#040810]/70 border border-[#D4AF37]/15 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
                    <div>
                      <div className="text-xs font-serif text-[#FAF5EF] font-medium">{k.title}</div>
                      <div className="text-[10px] text-[#A4B3C6]">{k.poet}</div>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0F3826]/40 text-[#C9A84C] border border-[#0F3826]">
                    {k.mood}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Attire & Dress Code */}
          <div className="mx-5 mb-6 p-4 rounded-2xl bg-[#0E182A]/50 border border-[#D4AF37]/20 text-center font-sans">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
              Suggested Attire
            </div>
            <div className="text-xs font-serif text-[#FAF5EF] mb-2.5">
              Royal Velvet Kurtas, Pashmina Shawls, Jamawar &amp; Classic South Asian Elegance
            </div>
            <div className="flex items-center justify-center gap-2">
              {dressCode.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="w-5 h-5 rounded-full border border-[#D4AF37]/40 shadow-sm"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[9px] text-[#A4B3C6]">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Floating Action Card */}
          <div className="mx-5 mb-8 p-5 rounded-3xl bg-gradient-to-b from-[#0F3826]/30 via-[#0E182A]/80 to-[#070D18] border border-[#D4AF37]/40 text-center font-sans shadow-xl">
            <h3 className="text-base font-serif text-[#FAF5EF] font-medium mb-1">Kindly Confirm Attendance</h3>
            <p className="text-xs text-[#A4B3C6] mb-4">Please respond to help us arrange your traditional seating and dinner feast.</p>

            {rsvpSubmitted ? (
              <div className="p-4 rounded-2xl bg-[#0F3826]/60 border border-[#D4AF37]/40 text-[#FAF5EF] flex items-center justify-center gap-2 text-xs">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                Shukriya! Your attendance has been confirmed with grace.
              </div>
            ) : (
              <button
                onClick={() => setRsvpOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C5A059] text-[#0A111F] font-semibold text-xs tracking-widest uppercase hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all"
              >
                Respond to Invitation (RSVP)
              </button>
            )}
          </div>

          {/* SECTION 7: SUNNAH DUA & FOOTER */}
          <footer className="pt-8 pb-10 px-6 sm:px-8 text-center bg-gradient-to-b from-[#0A111F] via-[#070D18] to-[#040810] border-t border-[#D4AF37]/25">
            <div className="max-w-xs mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF5EF] font-bold mb-2">We Eagerly Await You!</h2>

              <div className="my-5 p-4 rounded-2xl bg-[#0E182A]/90 border border-[#D4AF37]/45 shadow-sm text-center">
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
                {coupleName}
              </p>

              <p className="text-[10px] font-cinzel tracking-[0.25em] text-[#D4AF37] uppercase font-semibold mb-4">
                {hashtag}
              </p>
            </div>
          </footer>

          {/* Footer Card Credit */}
          <div className="text-center pb-8 pt-2 text-[#A4B3C6]/60 text-[10px] font-sans tracking-widest uppercase border-t border-[#D4AF37]/15 mx-6">
            VESNA Luxury Digital Atelier • &copy; {new Date().getFullYear()}
          </div>

        </div>
      </main>

      {/* RSVP Modal */}
      {rsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#0A111F] to-[#040810] rounded-3xl border border-[#D4AF37]/40 p-6 text-[#FAF5EF] shadow-2xl">
            <button
              onClick={() => setRsvpOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#A4B3C6] hover:text-[#FAF5EF] rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {rsvpSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-2" />
                <h3 className="font-serif text-lg font-bold text-[#FAF5EF]">Shukriya!</h3>
                <p className="text-xs text-[#A4B3C6] mt-1">We look forward to welcoming you to the Mehfil.</p>
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">RSVP</div>
                  <h3 className="font-serif text-lg text-[#FAF5EF] font-medium mt-0.5">{eventTitle}</h3>
                </div>

                <div>
                  <label className="block text-xs text-[#A4B3C6] mb-1">Your Full Name(s)</label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    placeholder="e.g. Dr. Salman & Family"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0E182A] border border-[#D4AF37]/30 text-[#FAF5EF] placeholder-[#A4B3C6]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A4B3C6] mb-1">Number of Attending Guests</label>
                  <select
                    value={rsvpForm.guests}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0E182A] border border-[#D4AF37]/30 text-[#FAF5EF] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Family Members</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#A4B3C6] mb-1">Will you be attending?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, attendance: 'attending' })}
                      className={`py-2 rounded-xl text-xs font-medium border transition ${
                        rsvpForm.attendance === 'attending'
                          ? 'bg-[#0F3826] border-[#D4AF37] text-[#FAF5EF]'
                          : 'bg-[#0E182A] border-[#D4AF37]/20 text-[#A4B3C6]'
                      }`}
                    >
                      Accept with Pleasure
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, attendance: 'declining' })}
                      className={`py-2 rounded-xl text-xs font-medium border transition ${
                        rsvpForm.attendance === 'declining'
                          ? 'bg-[#781220]/60 border-[#D4AF37] text-[#FAF5EF]'
                          : 'bg-[#0E182A] border-[#D4AF37]/20 text-[#A4B3C6]'
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
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#0A111F] text-xs font-semibold tracking-wider uppercase hover:brightness-110 shadow-lg mt-2"
                >
                  Submit Response
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

