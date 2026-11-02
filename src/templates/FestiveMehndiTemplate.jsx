'use client';

import React, { useState, useEffect } from 'react';
import UrduCalligraphyHeader from '@/components/UrduCalligraphyHeader';
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
  CheckCircle2
} from 'lucide-react';
import { submitRsvp } from '@/lib/supabase';

export default function FestiveMehndiTemplate({ data, isSample = false, invitationId }) {
  const brideName = data?.bride_name || "Ayesha Noor";
  const groomName = data?.groom_name || "Zayn Farooq";
  const coupleInitials = data?.couple_initials || "A & Z";
  const eventDateIso = data?.event_date_iso || "2026-11-05T19:00:00";
  const eventDateDisplay = data?.event_date_display || "Thursday • November 5, 2026";
  const eventTimeDisplay = data?.event_time_display || "Seven O'Clock in the Evening";
  const cityDisplay = data?.city_display || "Lahore, Pakistan";
  const venueName = data?.venue_name || "Haveli Garden Pavilion • Gulberg";
  const venueAddress = data?.venue_address || "Canal Road, Gulberg III, Lahore, Punjab, Pakistan";
  const venueMapUrl = data?.venue_map_url || "https://maps.google.com/?q=Lahore+Haveli";
  const hashtag = data?.hashtag || "#AYESHAGOTZAYNED";

  // Use the user's provided Mehndi couple image and family image as defaults
  const heroImage = data?.hero_image || "/assets/mehndi-couple.jpg";
  const familyImage = data?.family_image || "/assets/mehndi-family.jpg";
  const venueImage = data?.venue_image || "/assets/venue-hall.png";

  const schedule = data?.schedule || [
    { time: "7:00 PM", tag: "Arrival", title: "Dhol Beats & Welcome Drinks", desc: "Traditional sweet paan, fresh lassi, and lively dhol welcoming." },
    { time: "8:00 PM", tag: "Tradition", title: "Rasm-e-Heena & Oil Ceremony", desc: `Traditional Mehndi application for ${brideName} & ${groomName} with parental blessings.` },
    { time: "9:00 PM", tag: "Dance", title: "Bhangra & Sangeet Performances", desc: "Lively family dance-offs, cousins' medley, and celebratory music." },
    { time: "10:30 PM", tag: "Feast", title: "Mughlai BBQ & Festive Delicacies", desc: "Live sajji, fresh hot jalebis, and traditional Kashmiri chai." },
  ];

  // Palette extracted from user's image: Mustard yellow, Emerald green, Ivory white, Antique gold
  const dressCodeColors = [
    { name: "Mustard Haldi", hex: "#E89F12" },
    { name: "Emerald Green", hex: "#0E5336" },
    { name: "Warm Ivory", hex: "#FAF3E3" },
    { name: "Antique Gold", hex: "#D4AF37" },
  ];

  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', guests: '2', attendance: 'attending' });
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
    const title = encodeURIComponent(`${brideName} & ${groomName}'s Mehndi Night`);
    const details = encodeURIComponent(`Join us for an evening of music, dance, and henna celebrations!`);
    const location = encodeURIComponent(`${venueName}, ${venueAddress}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`, '_blank');
  };

  return (
    <div className="bg-[#031C11] text-gray-800 antialiased font-sans min-h-screen overflow-x-hidden relative selection:bg-marigold-400 selection:text-emeraldGreen-950">

      {isSample && (
        <div className="sticky top-0 z-40 bg-[#07321F]/90 backdrop-blur-md border-b border-marigold-400/30 text-marigold-200 text-center py-2 px-4 text-xs font-cinzel tracking-wider">
          🌼 Sample Template Showcase &bull; Jharokha Festive Mehndi &amp; Sangeet
        </div>
      )}

      <main className="relative z-10 w-full min-h-screen py-0 sm:py-10 flex justify-center items-start">
        <div className="w-full sm:max-w-[460px] bg-[#FFFBF0] text-emeraldGreen-950 sm:rounded-[36px] shadow-[0_25px_80px_rgba(0,0,0,0.85)] border-0 sm:border-2 sm:border-marigold-400/60 overflow-hidden relative">

          {/* Festive Marigold Garland Border */}
          <div className="absolute inset-2 sm:inset-3 border-2 border-dashed border-marigold-400/60 rounded-t-[170px] rounded-b-[28px] pointer-events-none z-10" />

          {/* PAGE 1: SPIRITUAL DEDICATION (BISMILLAH & SURAH AR-RUM 30:21) */}
          <section className="relative min-h-[92dvh] sm:min-h-[720px] flex flex-col justify-between items-center pt-10 pb-8 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FFFBF0] via-[#FFFBF0] to-[#FFFBF0]">
            {/* Ornate Top Header Filigree */}
            <div className="flex items-center justify-center pt-2">
              <svg className="w-36 h-7 text-marigold-500 opacity-90" viewBox="0 0 160 30" fill="currentColor">
                <path d="M80,3 C65,3 55,18 40,18 C28,18 20,8 10,15 C5,18 2,25 0,28 C10,25 22,23 35,23 C50,23 60,10 80,10 C100,10 110,23 125,23 C138,23 150,25 160,28 C158,25 155,18 150,15 C140,8 132,18 120,18 C105,18 95,3 80,3 Z" opacity="0.85" />
              </svg>
            </div>

            <div className="my-auto py-2 w-full flex flex-col items-center">
              <p className="font-amiri text-lg sm:text-xl text-emeraldGreen-900 font-normal tracking-wide mb-5 select-none">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              {/* Quranic Verse (Surah Ar-Rum 30:21) Card */}
              <div className="max-w-xs sm:max-w-sm mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FFF6DC] to-[#FDF0CE] border border-marigold-400/60 shadow-sm relative">
                <div className="flex items-center justify-center -mt-8 mb-2">
                  <span className="w-8 h-8 rounded-full bg-marigold-500 text-emeraldGreen-950 flex items-center justify-center border-2 border-[#FFFBF0] shadow-sm">
                    <Sparkles className="w-4 h-4 fill-current text-emeraldGreen-950" />
                  </span>
                </div>
                <p className="font-amiri text-base sm:text-lg text-emeraldGreen-950 font-bold leading-relaxed mb-3" dir="rtl">
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
                </p>
                <div className="w-12 h-px bg-marigold-400/60 mx-auto my-3" />
                <blockquote className="font-cormorant italic text-xs sm:text-sm text-emeraldGreen-900 leading-relaxed">
                  &ldquo;And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them, and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.&rdquo;
                </blockquote>
                <span className="inline-block mt-2.5 font-cinzel text-[10px] tracking-[0.2em] uppercase text-marigold-600 font-bold">
                  (Surah Ar-Rum 30:21)
                </span>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="pb-2 flex flex-col items-center justify-center opacity-75">
              <span className="text-[10px] font-cinzel tracking-[0.25em] uppercase text-marigold-700 mb-1.5 font-semibold">
                Scroll to View Invitation ♡
              </span>
              <div className="w-5 h-8 rounded-full border border-marigold-500 flex items-start justify-center p-1">
                <span className="w-1.5 h-2.5 bg-marigold-500 rounded-full animate-bounce" />
              </div>
            </div>
          </section>

          {/* TOP FESTIVE HEADER */}
          <header className="relative pt-12 pb-8 px-6 text-center bg-gradient-to-b from-[#FFF5DC] via-[#FFFBF0] to-[#FFFBF0]">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emeraldGreen-900 text-marigold-200 font-cinzel text-[10px] uppercase font-bold tracking-widest shadow-md mb-4 border border-marigold-400/40">
              <Sparkles className="w-3.5 h-3.5 text-marigold-400" />
              <span>Mehndi &bull; Mayun &bull; Sangeet</span>
            </div>

            <p className="font-cinzel text-xs tracking-[0.25em] uppercase text-marigold-600 font-bold mb-1">
              Let The Celebrations Begin!
            </p>

            {/* Optional Regal Urdu Calligraphy */}
            <UrduCalligraphyHeader data={data} className="text-emeraldGreen-900" />

            <h1 className="font-script text-5xl sm:text-6xl text-emeraldGreen-900 leading-tight my-2">
              {brideName}
            </h1>
            <div className="flex items-center justify-center gap-3 my-1">
              <span className="h-0.5 w-10 bg-marigold-400" />
              <span className="font-serif italic text-2xl text-marigold-600 font-bold">&amp;</span>
              <span className="h-0.5 w-10 bg-marigold-400" />
            </div>
            <h1 className="font-script text-5xl sm:text-6xl text-emeraldGreen-900 leading-tight">
              {groomName}
            </h1>

            {/* COUPLE HERO (Royal Arched Oval Silhouette Frame) */}
            {heroImage && (
              <div className="relative w-64 sm:w-72 mx-auto my-6 rounded-t-full rounded-b-2xl border-2 border-marigold-400 p-2 shadow-xl bg-gradient-to-b from-marigold-100/80 via-white to-marigold-100/40">
                <div className="w-full aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden relative shadow-inner bg-[#FBF6EA]">
                  <img
                    src={heroImage}
                    alt={`${brideName} & ${groomName} Mehndi`}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 rounded-t-full rounded-b-xl ring-1 ring-inset ring-marigold-400/40 pointer-events-none" />
                </div>
                <div className="mt-2 text-center">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] text-emeraldGreen-900 uppercase font-bold flex items-center justify-center gap-1.5">
                    <Music className="w-3 h-3 text-marigold-600" />
                    <span>Dholak Beats &amp; Henna Blessings</span>
                  </span>
                </div>
              </div>
            )}

            <div className="mt-2 inline-block px-5 py-2 rounded-full bg-emeraldGreen-900 text-marigold-200 border border-marigold-400/50 shadow-md">
              <p className="font-cinzel text-xs tracking-widest font-bold uppercase">
                {eventDateDisplay}
              </p>
            </div>
            <p className="font-serif italic text-sm text-emeraldGreen-900 mt-2 font-medium">
              {eventTimeDisplay} &bull; {cityDisplay}
            </p>
          </header>

          {/* LIVE COUNTDOWN */}
          <section className="py-6 px-6 text-center bg-gradient-to-b from-[#FFFBF0] to-[#FFF3D6]">
            <h3 className="font-cinzel text-xs tracking-widest uppercase text-emeraldGreen-900 font-bold mb-3">
              Counting Down To The Beats &amp; Henna
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
              <div className="bg-white p-3 rounded-xl border border-marigold-400/60 shadow-sm">
                <span className="font-serif text-2xl font-bold text-emeraldGreen-900">{timeLeft.days}</span>
                <span className="font-cinzel text-[9px] uppercase block text-emeraldGreen-800/70">Days</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-marigold-400/60 shadow-sm">
                <span className="font-serif text-2xl font-bold text-emeraldGreen-900">{timeLeft.hours}</span>
                <span className="font-cinzel text-[9px] uppercase block text-emeraldGreen-800/70">Hours</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-marigold-400/60 shadow-sm">
                <span className="font-serif text-2xl font-bold text-emeraldGreen-900">{timeLeft.minutes}</span>
                <span className="font-cinzel text-[9px] uppercase block text-emeraldGreen-800/70">Mins</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-marigold-400/60 shadow-sm">
                <span className="font-serif text-2xl font-bold text-marigold-600">{timeLeft.seconds}</span>
                <span className="font-cinzel text-[9px] uppercase block text-emeraldGreen-800/70">Secs</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleAddToCalendar}
                className="inline-flex items-center gap-1.5 text-xs font-cinzel text-emeraldGreen-900 hover:text-emeraldGreen-700 uppercase font-semibold"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-marigold-600" />
                Add to Google Calendar
              </button>
            </div>
          </section>

          {/* DRESS CODE PALETTE MATCHING THE ATTIRE */}
          <section className="py-6 px-6 text-center bg-white">
            <span className="font-cinzel text-[10px] tracking-widest uppercase text-marigold-600 font-bold">
              Festive Color Inspiration
            </span>
            <h2 className="font-serif text-2xl font-bold text-emeraldGreen-900 mb-2">Dress Code Palette</h2>
            <p className="font-sans text-xs text-emeraldGreen-900/70 mb-4 max-w-xs mx-auto">
              Embrace vibrant traditional tones for an evening of joyous dance and celebration.
            </p>

            <div className="flex items-center justify-center gap-4">
              {dressCodeColors.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full shadow-md border-2 border-white ring-1 ring-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[9px] font-sans font-medium text-emeraldGreen-900 mt-1 max-w-[50px] leading-tight">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* SCHEDULE OF EVENTS */}
          <section className="py-6 px-6">
            <h2 className="font-serif text-2xl font-bold text-emeraldGreen-900 text-center mb-5">
              The Night&apos;s Lineup
            </h2>
            <div className="space-y-4">
              {schedule.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-marigold-300 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-cinzel text-xs font-bold text-marigold-600">{item.time}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-marigold-100 text-emeraldGreen-900 font-medium font-sans">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-emeraldGreen-900">{item.title}</h3>
                  <p className="font-sans text-xs text-emeraldGreen-900/70 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* VENUE CARD */}
          <section className="py-6 px-6 bg-[#FFFBF0]">
            <div className="bg-white rounded-2xl border border-marigold-400 overflow-hidden shadow-md">
              {venueImage && (
                <div className="h-44 bg-emeraldGreen-950 relative overflow-hidden">
                  <img src={venueImage} alt={venueName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emeraldGreen-950 via-emeraldGreen-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-serif text-xl text-white font-bold">{venueName}</h3>
                  </div>
                </div>
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-marigold-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-emeraldGreen-900">{venueAddress}</p>
                </div>
                <a
                  href={venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emeraldGreen-900 hover:bg-emeraldGreen-800 text-marigold-200 font-cinzel text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow-sm transition-all"
                >
                  <Navigation className="w-4 h-4 text-marigold-400" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </section>

          {/* CHERISHED MEHNDI FAMILY & SIBLINGS SECTION */}
          {familyImage && (
            <section className="py-8 px-6 text-center bg-gradient-to-b from-[#FFFBF0] via-[#FFF6DC] to-[#FFFBF0]">
              <div className="max-w-xs sm:max-w-sm mx-auto mb-3">
                <span className="font-cinzel text-[10px] tracking-widest uppercase text-marigold-600 font-bold block mb-1">
                  — The Loving Hosts &amp; Cousins —
                </span>
                <h2 className="font-serif text-2xl font-bold text-emeraldGreen-900 mb-2">
                  Cherished Family &amp; Friends
                </h2>
                <p className="font-sans text-xs text-emeraldGreen-900/80 leading-relaxed">
                  &ldquo;Surrounded by the warmth, laughter, and blessings of our beloved brothers, sisters, and cousins who make every celebration unforgettable.&rdquo;
                </p>
              </div>

              <div className="relative w-full max-w-sm mx-auto my-4 rounded-2xl border-2 border-marigold-400/80 p-2 shadow-xl bg-white">
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden relative shadow-inner">
                  <img
                    src={familyImage}
                    alt="Mehndi Family Gathering"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-marigold-400/30 rounded-xl pointer-events-none" />
                </div>
              </div>

              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emeraldGreen-900 text-marigold-200 text-[10px] font-cinzel uppercase font-bold tracking-wider shadow-sm">
                  <Sparkles className="w-3 h-3 text-marigold-400" />
                  <span>With Best Compliments from Both Families</span>
                </span>
              </div>
            </section>
          )}

          {/* RSVP TRIGGER */}
          <section className="py-6 px-6 text-center bg-emeraldGreen-900 text-marigold-100">
            <h2 className="font-serif text-2xl font-bold mb-1">Join the Festivities!</h2>
            <p className="font-sans text-xs text-marigold-200/90 mb-4">
              Please RSVP by 1st November to ensure sweet hospitality and seating.
            </p>
            <button
              onClick={() => setRsvpOpen(true)}
              className="w-full py-3.5 rounded-xl bg-marigold-400 hover:bg-marigold-300 text-emeraldGreen-950 font-cinzel text-xs font-bold uppercase tracking-widest shadow-lg transition-transform active:scale-95"
            >
              Respond to RSVP
            </button>
          </section>

          {/* SECTION 7: SUNNAH DUA & FOOTER */}
          <footer className="pt-8 pb-14 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FFFBF0] via-[#FFF3D6] to-[#FFE8B3]">
            <div className="max-w-xs mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-emeraldGreen-900 font-bold mb-2">We Eagerly Await You!</h2>

              <div className="my-5 p-4 rounded-2xl bg-white/90 border border-marigold-400/60 shadow-sm text-center">
                <span className="inline-flex items-center gap-1.5 font-cinzel text-[10px] tracking-[0.25em] uppercase text-marigold-600 font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  A Sacred Prayer
                </span>
                <p className="font-amiri text-base sm:text-lg text-emeraldGreen-950 font-bold leading-relaxed mb-2" dir="rtl">
                  بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                </p>
                <div className="w-10 h-0.5 bg-marigold-400/50 mx-auto my-2" />
                <p className="font-cormorant italic text-sm sm:text-base text-emeraldGreen-900 leading-relaxed font-medium">
                  &ldquo;May Allah bless this union, bind your hearts with lifelong affection and mercy, and make your home a sanctuary of peace.&rdquo;
                </p>
              </div>

              <p className="font-cormorant italic text-base text-emeraldGreen-900/80 mb-2">
                With love, prayers &amp; eternal gratitude,
              </p>
              <p className="font-script text-4xl sm:text-5xl text-emeraldGreen-900 mb-6">
                {brideName.split(' ')[0]} &amp; {groomName.split(' ')[0]}
              </p>

              <p className="text-[10px] font-cinzel tracking-[0.25em] text-emeraldGreen-900/70 uppercase font-semibold">
                {hashtag}
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* RSVP MODAL */}
      {rsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white rounded-3xl border border-marigold-400 p-6 text-emeraldGreen-950">
            <button onClick={() => setRsvpOpen(false)} className="absolute top-4 right-4 p-1 text-gray-500">
              <X className="w-5 h-5" />
            </button>
            {rsvpSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-serif text-xl font-bold">See You on the Dance Floor!</h3>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-center">RSVP for Mehndi Night</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    placeholder="e.g. Sana & Family"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-marigold-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={async () => {
                    setRsvpSubmitted(true);
                    try {
                      if (invitationId) {
                        await submitRsvp({
                          invitation_id: invitationId,
                          guest_name: rsvpForm.name || 'Anonymous Guest',
                          attendance: 'attending',
                          guest_count: 2,
                        });
                      }
                    } catch (err) {
                      console.error('RSVP submit error:', err);
                    }
                    setTimeout(() => { setRsvpOpen(false); setRsvpSubmitted(false); }, 2000);
                  }}
                  className="w-full py-3 rounded-xl bg-emeraldGreen-900 text-marigold-200 font-cinzel text-xs font-bold uppercase"
                >
                  Confirm Attendance
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AMBIENT AUDIO TOGGLE */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-emeraldGreen-900 text-marigold-300 border border-marigold-400 shadow-xl"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

    </div>
  );
}
