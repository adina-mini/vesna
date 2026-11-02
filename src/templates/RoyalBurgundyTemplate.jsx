'use client';

import React, { useState, useEffect } from 'react';
import UrduCalligraphyHeader from '@/components/UrduCalligraphyHeader';
import {
  Sparkles,
  Heart,
  Clock,
  MapPin,
  Car,
  Navigation,
  CalendarPlus,
  Users,
  Utensils,
  Hourglass,
  Gift,
  Volume2,
  VolumeX,
  X,
  CheckCircle2
} from 'lucide-react';
import { submitRsvp } from '@/lib/supabase';

export default function RoyalBurgundyTemplate({ data, isSample = false, invitationId, suppressIntro = false }) {
  // Normalize fields with robust fallbacks
  const brideName = data?.bride_name || "Fatima Hafeez";
  const groomName = data?.groom_name || "Rao Sharjeel";
  const coupleInitials = data?.couple_initials || (brideName[0] && groomName[0] ? `${brideName[0]} & ${groomName[0]}` : "F & S");
  const eventDateIso = data?.event_date_iso || "2026-11-07T12:00:00";
  const eventDateDisplay = data?.event_date_display || "Saturday • November 7, 2026";
  const eventTimeDisplay = data?.event_time_display || "Twelve O'Clock in the Afternoon";
  const cityDisplay = data?.city_display || "Bahawalpur, Pakistan";
  const venueName = data?.venue_name || "Rashid Banquet Hall";
  const venueAddress = data?.venue_address || "Ahmadpur Bypass, Sharifabad Chowk, Bahawalpur, Punjab, Pakistan • 63100";
  const venueMapUrl = data?.venue_map_url || "https://maps.google.com/?q=Rashid+Banquet+Hall+Bahawalpur";
  const hashtag = data?.hashtag || "#FATIMAANDSHARJEEL2026";

  // Images
  const introImage = data?.intro_image || "/assets/couple-golden-intro.jpg";
  const heroImage = data?.hero_image || "/assets/couple-hero.jpg";
  const venueImage = data?.venue_image || "/assets/barat-stage-venue.jpg";
  const familyStickerImage = data?.family_sticker_image || "/assets/family-sticker.png";

  // Schedule timeline
  const schedule = data?.schedule || [
    { time: "12:00 PM", tag: "Reception", title: "Guest Arrival", desc: "Welcome refreshments, traditional hospitality, and gathering of our cherished family & guests.", icon: "users" },
    { time: "12:30 PM", tag: "Grand Entrance", title: "Barat Arrival", desc: `Grand welcoming of the groom ${groomName} & his family with traditional flower garlands and warmth.`, icon: "sparkles" },
    { time: "1:00 PM", tag: "Main Stage", title: "Nikah • The Sacred Ceremony", desc: `The sacred solemnization of marriage vows, Quranic recitation, and prayers for ${brideName} & ${groomName}.`, icon: "heart", highlight: true },
    { time: "1:30 PM", tag: "Dining Hall", title: "Royal Wedding Lunch", desc: "A rich traditional luncheon feast, sweet delicacies, and celebratory family photography.", icon: "utensils" },
    { time: "4:00 PM", tag: "Grand Pavilion", title: "Rukhsati • Farewell", desc: "An emotional farewell, heartfelt prayers, and sending off the bride with eternal love and blessings.", icon: "sparkles" },
  ];

  // Intro gate state
  const [introDismissed, setIntroDismissed] = useState(false);
  const [introActive, setIntroActive] = useState(false);

  // RSVP Modal
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', guests: '2', attendance: 'attending', notes: '' });

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  // Sound toggle state (mock/ambient)
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Trigger stroke animation after mount
    const timer = setTimeout(() => {
      setIntroActive(true);
    }, 100);

    // Auto dismiss intro gate after 2.6s
    const dismissTimer = setTimeout(() => {
      setIntroDismissed(true);
    }, 2600);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, []);

  useEffect(() => {
    function calculateCountdown() {
      const target = new Date(eventDateIso).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    }

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eventDateIso]);

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${brideName} & ${groomName}'s Wedding`);
    const details = encodeURIComponent(`We warmly invite you to celebrate the wedding union of ${brideName} & ${groomName} at ${venueName}.`);
    const location = encodeURIComponent(`${venueName}, ${venueAddress}`);
    // Format YYYYMMDDTHHMMSS
    const dateFormatted = eventDateIso.replace(/[-:]/g, '').split('.')[0] + 'Z';
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    try {
      if (invitationId) {
        await submitRsvp({
          invitation_id: invitationId,
          guest_name: rsvpForm.name,
          attendance: rsvpForm.attendance,
          guest_count: rsvpForm.guests,
          notes: rsvpForm.notes,
        });
      }
    } catch (err) {
      console.error('RSVP submit error:', err);
    }
    setTimeout(() => {
      setRsvpOpen(false);
      setRsvpSubmitted(false);
    }, 2200);
  };

  return (
    <div className="bg-wine-950 text-gray-800 antialiased font-sans min-h-screen selection:bg-champagne-500 selection:text-wine-950 overflow-x-hidden relative">

      {/* LUXURY GOLDEN RING INTRO GATE */}
      {!suppressIntro && !introDismissed && (
        <div
          onClick={() => setIntroDismissed(true)}
          className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer transition-opacity duration-1000 ${
            introDismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{
            background: 'radial-gradient(circle at 50% 50%, #42070D 0%, #35050A 45%, #240307 80%, #150204 100%)',
          }}
        >
          <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
            <img
              src={introImage}
              alt="Wedding Couple Intro"
              className="w-full h-full object-contain rounded-full select-none"
              style={{
                maskImage: 'radial-gradient(circle at 50% 50%, black 65%, rgba(0,0,0,0.9) 82%, transparent 98%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 65%, rgba(0,0,0,0.9) 82%, transparent 98%)'
              }}
            />
            {/* Circular Ring SVG Animation */}
            <svg
              className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none -rotate-90 origin-center"
              viewBox="0 0 200 200"
            >
              <defs>
                <linearGradient id="introGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2C2" />
                  <stop offset="35%" stopColor="#D4AF37" />
                  <stop offset="70%" stopColor="#F5E8BA" />
                  <stop offset="100%" stopColor="#A98018" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke="rgba(212, 175, 55, 0.15)"
                strokeWidth="1.5"
              />
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke="url(#introGoldGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset={introActive ? "0" : "100"}
                pathLength="100"
                style={{
                  transition: 'stroke-dashoffset 2.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.8))',
                }}
              />
            </svg>
          </div>
          <p className="absolute bottom-10 font-cinzel text-xs tracking-[0.3em] uppercase text-champagne-300 animate-pulse">
            Tap to Open Invitation
          </p>
        </div>
      )}

      {/* SAMPLE WATERMARK (IF IN SAMPLE MODE) */}
      {isSample && (
        <div className="sticky top-0 z-40 bg-wine-900/90 backdrop-blur-md border-b border-champagne-500/30 text-champagne-200 text-center py-2 px-4 text-xs font-cinzel tracking-wider">
          👑 Sample Template Showcase &bull; Original Sample Design
        </div>
      )}

      {/* MAIN INVITATION CARD CONTAINER */}
      <main className="relative z-10 w-full min-h-screen py-0 sm:py-10 flex justify-center items-start">
        <div
          className={`w-full sm:max-w-[460px] bg-parchment-100 text-wine-950 sm:rounded-[36px] shadow-[0_25px_80px_rgba(0,0,0,0.85)] border-0 sm:border sm:border-champagne-500/50 overflow-hidden relative transition-opacity duration-1000 ${
            suppressIntro || introDismissed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Golden Regal Arch Border Inset */}
          <div className="absolute inset-2 sm:inset-3 border border-champagne-500/65 shadow-[0_0_12px_rgba(212,175,55,0.18)] rounded-t-[170px] rounded-b-[28px] pointer-events-none z-10" />
          <div className="absolute inset-3.5 sm:inset-4.5 border border-wine-800/35 rounded-t-[162px] rounded-b-[24px] pointer-events-none z-10" />

          {/* PAGE 1: SPIRITUAL DEDICATION (BISMILLAH & AR-RUM 30:21) */}
          <section className="relative min-h-[92dvh] sm:min-h-[720px] flex flex-col justify-between items-center pt-10 pb-8 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FAF5EF] via-[#FAF5EF] to-[#FAF5EF]">
            {/* Ornate Top Header Filigree */}
            <div className="flex items-center justify-center pt-2">
              <svg className="w-36 h-7 text-champagne-500 opacity-90" viewBox="0 0 160 30" fill="currentColor">
                <path d="M80,3 C65,3 55,18 40,18 C28,18 20,8 10,15 C5,18 2,25 0,28 C10,25 22,23 35,23 C50,23 60,10 80,10 C100,10 110,23 125,23 C138,23 150,25 160,28 C158,25 155,18 150,15 C140,8 132,18 120,18 C105,18 95,3 80,3 Z" opacity="0.85" />
              </svg>
            </div>

            <div className="my-auto py-2 w-full flex flex-col items-center">
              <p className="font-amiri text-lg sm:text-xl text-wine-900/90 font-normal tracking-wide mb-5 select-none">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              {/* Quranic Verse Card */}
              <div className="max-w-xs sm:max-w-sm mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FAF2E6] to-[#F5EAD9] border border-champagne-500/50 shadow-sm relative">
                <div className="flex items-center justify-center -mt-8 mb-2">
                  <span className="w-8 h-8 rounded-full bg-champagne-500 text-wine-950 flex items-center justify-center border-2 border-[#FAF5EF] shadow-sm">
                    <Sparkles className="w-4 h-4 fill-current" />
                  </span>
                </div>
                <p className="font-amiri text-base sm:text-lg text-wine-950 font-bold leading-relaxed mb-3" dir="rtl">
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
                </p>
                <div className="w-12 h-px bg-champagne-500/60 mx-auto my-3" />
                <blockquote className="font-cormorant italic text-xs sm:text-sm text-wine-900/90 leading-relaxed">
                  &ldquo;And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them, and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.&rdquo;
                </blockquote>
                <span className="inline-block mt-2.5 font-cinzel text-[10px] tracking-[0.2em] uppercase text-champagne-600 font-bold">
                  (Surah Ar-Rum 30:21)
                </span>
              </div>
            </div>

            <div className="pb-2 flex flex-col items-center justify-center opacity-75">
              <span className="text-[10px] font-cinzel tracking-[0.25em] uppercase text-champagne-700 mb-1.5 font-semibold">
                Scroll to View Invitation ♡
              </span>
              <div className="w-5 h-8 rounded-full border border-champagne-500 flex items-start justify-center p-1">
                <span className="w-1.5 h-2.5 bg-champagne-600 rounded-full animate-bounce" />
              </div>
            </div>
          </section>

          {/* SECTION 1: HERO / MAIN INVITATION HEADER */}
          <header className="relative pt-6 pb-8 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FAF5EF] via-[#FAF5EF] to-[#FAF5EF]">
            {/* Monogram Crest */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-champagne-500 flex items-center justify-center bg-gradient-to-br from-wine-900 via-wine-800 to-wine-950 shadow-[0_4px_16px_rgba(66,11,19,0.35)] ring-2 ring-champagne-500/40">
              <span className="font-cinzelDeco text-lg tracking-widest text-champagne-300 font-bold">
                {coupleInitials}
              </span>
            </div>

            <p className="font-cinzel text-[11px] sm:text-xs tracking-[0.3em] uppercase text-champagne-700 mb-1.5 font-semibold">
              Together With Their Families
            </p>
            <p className="font-cormorant italic text-sm text-wine-900/80 mb-3">
              cordially invite you to celebrate the joyous wedding union of
            </p>

            {/* Optional Regal Urdu Calligraphy */}
            <UrduCalligraphyHeader data={data} className="text-wine-900" />

            {/* Couple Names */}
            <div className="my-3">
              <h1 className="font-script text-5xl sm:text-6xl text-wine-900 leading-tight">
                {brideName}
              </h1>
              <div className="flex items-center justify-center gap-3 my-1.5">
                <span className="h-0.5 w-12 bg-gradient-to-r from-transparent via-champagne-400 to-champagne-500" />
                <span className="font-cormorant italic text-2xl text-champagne-600 font-bold">&amp;</span>
                <span className="h-0.5 w-12 bg-gradient-to-l from-transparent via-champagne-400 to-champagne-500" />
              </div>
              <h1 className="font-script text-5xl sm:text-6xl text-wine-900 leading-tight">
                {groomName}
              </h1>
            </div>

            {/* Couple Hero Photo Frame */}
            {heroImage && (
              <div className="relative w-64 sm:w-72 mx-auto my-6 rounded-t-full rounded-b-2xl border-2 border-champagne-500/50 p-2 shadow-lg bg-gradient-to-b from-champagne-100/70 via-white to-champagne-100/40">
                <div className="w-full aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden relative shadow-inner bg-[#F5EADF]">
                  <img
                    src={heroImage}
                    alt={`${brideName} & ${groomName}`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-t-full rounded-b-xl ring-1 ring-inset ring-champagne-500/30 pointer-events-none" />
                </div>
                <div className="mt-2 text-center">
                  <span className="font-cinzel text-[10px] tracking-[0.25em] text-wine-900/80 uppercase font-semibold">
                    Together in Eternal Grace
                  </span>
                </div>
              </div>
            )}

            {/* Event Date Ribbon */}
            <div className="mt-4 flex flex-col items-center">
              <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-wine-950 via-wine-900 to-wine-950 border border-champagne-500/60 shadow-md">
                <p className="font-cinzel text-xs sm:text-sm tracking-[0.25em] font-bold text-champagne-200 uppercase">
                  {eventDateDisplay}
                </p>
              </div>
              <p className="font-cormorant italic text-sm text-wine-900/90 font-medium mt-2">
                {eventTimeDisplay} &bull; {cityDisplay}
              </p>
            </div>
          </header>

          {/* SECTION 2: LIVE COUNTDOWN */}
          <section className="py-8 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FAF5EF] via-[#FAF5EE] to-[#FAF5EF]">
            <div className="max-w-xs mx-auto mb-5">
              <span className="text-champagne-600 font-cinzel text-[11px] tracking-widest uppercase block mb-1 font-semibold">
                Save The Date
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-wine-900 font-bold">Counting Down</h2>
              <div className="w-12 h-0.5 bg-champagne-500 mx-auto mt-2 mb-2" />
              <p className="font-sans text-xs text-wine-800/75 leading-relaxed">
                Every passing moment brings us closer to our sacred vows. We eagerly anticipate your gracious company and prayers.
              </p>
            </div>

            {/* Countdown Box */}
            <div className="bg-gradient-to-b from-[#FAF5EE] to-[#F3E5AB]/25 p-5 rounded-2xl border border-champagne-500/45 shadow-sm">
              <h3 className="font-cinzel text-xs tracking-[0.2em] uppercase text-wine-900/85 mb-4 font-semibold flex items-center justify-center gap-2">
                <Hourglass className="w-3.5 h-3.5 text-champagne-600" />
                Counting Down To The Big Day
              </h3>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/85 backdrop-blur-sm border border-champagne-500/40 rounded-xl py-3 px-1 shadow-sm flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-wine-900">{timeLeft.days}</span>
                  <span className="font-cinzel text-[9px] tracking-widest uppercase text-wine-800/70 mt-1">Days</span>
                </div>
                <div className="bg-white/85 backdrop-blur-sm border border-champagne-500/40 rounded-xl py-3 px-1 shadow-sm flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-wine-900">{timeLeft.hours}</span>
                  <span className="font-cinzel text-[9px] tracking-widest uppercase text-wine-800/70 mt-1">Hours</span>
                </div>
                <div className="bg-white/85 backdrop-blur-sm border border-champagne-500/40 rounded-xl py-3 px-1 shadow-sm flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-wine-900">{timeLeft.minutes}</span>
                  <span className="font-cinzel text-[9px] tracking-widest uppercase text-wine-800/70 mt-1">Mins</span>
                </div>
                <div className="bg-white/85 backdrop-blur-sm border border-champagne-500/40 rounded-xl py-3 px-1 shadow-sm flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-champagne-600">{timeLeft.seconds}</span>
                  <span className="font-cinzel text-[9px] tracking-widest uppercase text-wine-800/70 mt-1">Secs</span>
                </div>
              </div>

              {/* Add to Calendar Button */}
              <div className="mt-4 pt-3 border-t border-champagne-400/25 text-center">
                <button
                  onClick={handleAddToCalendar}
                  className="inline-flex items-center gap-2 text-xs font-cinzel tracking-wider text-wine-800 hover:text-wine-950 transition-colors uppercase font-medium"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-champagne-600" />
                  Add to Google Calendar
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3: ITINERARY TIMELINE */}
          <section className="py-8 px-6 sm:px-8">
            <div className="text-center mb-8">
              <span className="text-champagne-600 font-cinzel text-xs tracking-widest uppercase block mb-1">Itinerary</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-wine-900 font-bold">Schedule of Events</h2>
              <div className="w-12 h-0.5 bg-champagne-500 mx-auto mt-2 mb-3" />
              <p className="font-cormorant italic text-sm sm:text-base text-wine-900/80 max-w-xs mx-auto">
                &ldquo;We warmly invite you to join us as each sacred milestone of our joyous day unfolds.&rdquo;
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-champagne-400 before:via-champagne-500 before:to-champagne-300">
              {schedule.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-wine-800 border-2 border-champagne-400 flex items-center justify-center text-champagne-200 shadow-sm">
                    {item.highlight ? <Heart className="w-3 h-3 fill-current text-champagne-300" /> : <Clock className="w-3 h-3" />}
                  </div>
                  <div className={`p-4 rounded-xl border shadow-sm ${item.highlight ? 'bg-white/95 border-champagne-500 ring-1 ring-champagne-500/20' : 'bg-white/90 border-champagne-400/30'}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-cinzel text-xs font-bold text-champagne-600 tracking-wider">{item.time}</span>
                      <span className={`text-[9px] font-sans px-2 py-0.5 rounded-full font-medium ${item.highlight ? 'bg-wine-800 text-champagne-200' : 'bg-champagne-100 text-wine-800'}`}>
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-wine-900">{item.title}</h3>
                    <p className="font-sans text-xs text-wine-900/70 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: VENUE & GOOGLE MAPS */}
          <section className="py-8 px-6 sm:px-8 text-center bg-parchment-50">
            <div className="mb-6">
              <span className="text-champagne-600 font-cinzel text-xs tracking-widest uppercase block mb-1">Destination</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-wine-900 font-bold">Venue &amp; Location</h2>
              <div className="w-12 h-0.5 bg-champagne-500 mx-auto mt-2" />
            </div>

            <div className="bg-white rounded-2xl border border-champagne-500/40 overflow-hidden shadow-md text-left">
              {venueImage && (
                <div className="relative h-48 sm:h-52 overflow-hidden bg-wine-950">
                  <img
                    src={venueImage}
                    alt={venueName}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <span className="inline-block bg-champagne-500 text-wine-950 font-cinzel text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full mb-1 shadow-sm">
                      Celebration Hall
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-champagne-100 font-bold drop-shadow-md">
                      {venueName}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-champagne-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans font-semibold text-wine-900 text-sm">{venueAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <Car className="w-5 h-5 text-champagne-600 flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-wine-900/70">
                    Spacious parking and valet assistance available for all respected guests upon arrival.
                  </p>
                </div>

                <a
                  href={venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-wine-900 to-wine-800 hover:from-wine-800 hover:to-wine-700 text-champagne-200 font-cinzel text-xs font-semibold uppercase tracking-wider py-3 px-4 rounded-xl border border-champagne-500/40 shadow-sm transition-all"
                >
                  <Navigation className="w-4 h-4 text-champagne-400" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 5: FAMILY STICKER / PORTRAIT */}
          {familyStickerImage && (
            <section className="py-8 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FAF5EF] via-[#FAF2E6] to-[#FAF5EF]">
              <div className="max-w-xs sm:max-w-sm mx-auto mb-4">
                <span className="text-champagne-600 font-cinzel text-[11px] tracking-widest uppercase block mb-1 font-semibold">
                  — The Loving Hosts —
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-wine-900 font-bold">With Parental Blessings</h2>
                <div className="w-12 h-0.5 bg-champagne-500 mx-auto mt-2 mb-3" />
                <p className="font-cormorant text-base sm:text-lg text-wine-900/90 leading-relaxed italic">
                  &ldquo;With the grace of Almighty Allah and the prayers of our respected parents and elders, two families unite in love, honor, and joy.&rdquo;
                </p>
              </div>

              <div className="relative w-full max-w-sm mx-auto my-4">
                <img
                  src={familyStickerImage}
                  alt="Family Portrait"
                  className="w-full h-auto object-contain mx-auto filter drop-shadow-[0_12px_24px_rgba(45,8,13,0.18)]"
                />
              </div>

              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-100/90 border border-champagne-400/50 text-[10px] font-cinzel tracking-wider uppercase text-wine-900 font-semibold shadow-sm">
                  <Sparkles className="w-3 h-3 text-champagne-600" />
                  With Best Compliments from Family &amp; Friends
                </span>
              </div>
            </section>
          )}

          {/* SECTION 6: RSVP INTERACTION BUTTON */}
          <section className="py-8 px-6 sm:px-8 text-center bg-wine-900 text-champagne-100 relative">
            <div className="max-w-xs mx-auto">
              <Gift className="w-8 h-8 text-champagne-400 mx-auto mb-2" />
              <h2 className="font-serif text-2xl font-bold text-champagne-100 mb-1">Kindly Confirm RSVP</h2>
              <p className="font-sans text-xs text-champagne-200/80 mb-5">
                Please let us know if you will be celebrating with us to help us arrange the finest hospitality.
              </p>
              <button
                onClick={() => setRsvpOpen(true)}
                className="w-full py-3.5 px-6 rounded-xl bg-champagne-500 hover:bg-champagne-400 text-wine-950 font-cinzel text-xs font-bold uppercase tracking-widest shadow-lg transition-transform active:scale-95"
              >
                Respond to Invitation
              </button>
            </div>
          </section>

          {/* SECTION 7: SUNNAH DUA & FOOTER */}
          <footer className="pt-8 pb-14 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FAF5EF] via-[#F5EADF] to-[#E9D9C5]">
            <div className="max-w-xs mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-wine-900 font-bold mb-2">We Eagerly Await You!</h2>

              <div className="my-5 p-4 rounded-2xl bg-white/80 border border-champagne-500/45 shadow-sm text-center">
                <span className="inline-flex items-center gap-1.5 font-cinzel text-[10px] tracking-[0.25em] uppercase text-champagne-600 font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  A Sacred Prayer
                </span>
                <p className="font-amiri text-base sm:text-lg text-wine-950 font-bold leading-relaxed mb-2" dir="rtl">
                  بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                </p>
                <div className="w-10 h-0.5 bg-champagne-500/50 mx-auto my-2" />
                <p className="font-cormorant italic text-sm sm:text-base text-wine-900/90 leading-relaxed font-medium">
                  &ldquo;May Allah bless this union, bind your hearts with lifelong affection and mercy, and make your home a sanctuary of peace.&rdquo;
                </p>
              </div>

              <p className="font-cormorant italic text-base text-wine-800/85 mb-2">
                With love, prayers &amp; eternal gratitude,
              </p>
              <p className="font-script text-4xl sm:text-5xl text-wine-900 mb-6">
                {brideName.split(' ')[0]} &amp; {groomName.split(' ')[0]}
              </p>

              <p className="text-[10px] font-cinzel tracking-[0.25em] text-wine-900/70 uppercase font-semibold">
                {hashtag}
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* RSVP MODAL POPUP */}
      {rsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-parchment-100 rounded-3xl border border-champagne-500 shadow-2xl p-6 text-wine-950">
            <button
              onClick={() => setRsvpOpen(false)}
              className="absolute top-4 right-4 p-1 text-wine-900/60 hover:text-wine-950"
            >
              <X className="w-5 h-5" />
            </button>

            {rsvpSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3 animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-wine-900">Thank You!</h3>
                <p className="font-sans text-xs text-wine-800/80 mt-1">
                  Your response has been graciously received. We look forward to celebrating together!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <span className="font-cinzel text-[10px] tracking-widest uppercase text-champagne-600 font-bold">
                    RSVP Response
                  </span>
                  <h3 className="font-serif text-xl font-bold text-wine-900">Celebrate With Us</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-wine-900 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    placeholder="e.g. Dr. Haris & Family"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne-400 bg-white focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-wine-900 mb-1">Will you attend?</label>
                  <select
                    value={rsvpForm.attendance}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne-400 bg-white focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  >
                    <option value="attending">Joyfully Accept (Attending)</option>
                    <option value="declined">Regretfully Decline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-wine-900 mb-1">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rsvpForm.guests}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne-400 bg-white focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-wine-900 mb-1">Heartfelt Prayers / Notes</label>
                  <textarea
                    rows={2}
                    value={rsvpForm.notes}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, notes: e.target.value })}
                    placeholder="Leave a prayer or message..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne-400 bg-white focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-wine-900 hover:bg-wine-800 text-champagne-200 font-cinzel text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                >
                  Confirm RSVP
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FLOATING AMBIENT AUDIO BUTTON */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-wine-900/90 text-champagne-300 border border-champagne-500/50 shadow-xl backdrop-blur-sm hover:scale-110 transition-transform"
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

    </div>
  );
}
