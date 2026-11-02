'use client';

import React, { useState, useEffect } from 'react';
import UrduCalligraphyHeader from '@/components/UrduCalligraphyHeader';
import {
  Sparkles,
  Heart,
  Clock,
  MapPin,
  CalendarPlus,
  Navigation,
  Gift,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Utensils
} from 'lucide-react';
import { submitRsvp } from '@/lib/supabase';

export default function NoorWalimaTemplate({ data, isSample = false, invitationId }) {
  const brideName = data?.bride_name || "Zainab Malik";
  const groomName = data?.groom_name || "Daniyal Ahmed";
  const coupleInitials = data?.couple_initials || "Z & D";
  const eventDateIso = data?.event_date_iso || "2026-11-09T20:00:00";
  const eventDateDisplay = data?.event_date_display || "Monday • November 9, 2026";
  const eventTimeDisplay = data?.event_time_display || "Eight O'Clock in the Evening";
  const cityDisplay = data?.city_display || "Islamabad, Pakistan";
  const venueName = data?.venue_name || "Serena Hotel • Grand Sheesh Mahal";
  const venueAddress = data?.venue_address || "Khayaban-e-Suhrawardy, Sector G-5/1, Islamabad";
  const venueMapUrl = data?.venue_map_url || "https://maps.google.com/?q=Serena+Hotel+Islamabad";
  const hashtag = data?.hashtag || "#ZAINABANDDANIYAL2026";

  // Use the user's provided Reception couple image and family image as default
  const heroImage = data?.hero_image || "/assets/reception-couple.jpg";
  const familyImage = data?.family_image || "/assets/reception-family.jpg";
  const venueImage = data?.venue_image || "/assets/walima-venue.jpg";

  const schedule = data?.schedule || [
    { time: "8:00 PM", tag: "Arrival", title: "Welcome & Ethereal Mocktails", desc: "Guests gather in the illuminated foyer with soft ambient classical music." },
    { time: "8:45 PM", tag: "Grand Entrance", title: "Entrance of the Newlyweds", desc: `${groomName} & ${brideName} make their grand reception entrance together.` },
    { time: "9:30 PM", tag: "Dinner", title: "Royal Continental & Mughlai Banquet", desc: "An exquisite dinner buffet accompanied by live acoustic melodies." },
    { time: "11:00 PM", tag: "Blessings", title: "Cake Cutting & Closing Blessings", desc: "Cherished moments, family photography, and heartfelt prayers." },
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
    const title = encodeURIComponent(`${brideName} & ${groomName}'s Walima Reception`);
    const details = encodeURIComponent(`We cordially invite you to celebrate our Walima dinner reception.`);
    const location = encodeURIComponent(`${venueName}, ${venueAddress}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`, '_blank');
  };

  return (
    <div className="bg-[#140609] text-gray-800 antialiased font-sans min-h-screen overflow-x-hidden relative selection:bg-champagne-500 selection:text-wine-950">

      {isSample && (
        <div className="sticky top-0 z-40 bg-[#280811]/90 backdrop-blur-md border-b border-champagne-500/30 text-champagne-200 text-center py-2 px-4 text-xs font-cinzel tracking-wider">
          🕯️ Sample Template Showcase &bull; Royal Reception &amp; Walima Banquet
        </div>
      )}

      <main className="relative z-10 w-full min-h-screen py-0 sm:py-10 flex justify-center items-start">
        <div className="w-full sm:max-w-[460px] bg-[#FAF5EE] text-[#24060C] sm:rounded-[36px] shadow-[0_25px_80px_rgba(0,0,0,0.85)] border-0 sm:border border-champagne-500/40 overflow-hidden relative">

          {/* Regal Arch Border Inset */}
          <div className="absolute inset-2 sm:inset-3 border border-champagne-500/50 rounded-t-[160px] rounded-b-[28px] pointer-events-none z-10" />
          <div className="absolute inset-3.5 sm:inset-4.5 border border-wine-900/20 rounded-t-[152px] rounded-b-[24px] pointer-events-none z-10" />

          {/* PAGE 1: SPIRITUAL DEDICATION (BISMILLAH & SURAH AR-RUM 30:21) */}
          <section className="relative min-h-[92dvh] sm:min-h-[720px] flex flex-col justify-between items-center pt-10 pb-8 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FAF5EE] via-[#FAF5EE] to-[#FAF5EE]">
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

              {/* Quranic Verse (Surah Ar-Rum 30:21) Card */}
              <div className="max-w-xs sm:max-w-sm mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FAF2E6] to-[#F5EAD9] border border-champagne-500/50 shadow-sm relative">
                <div className="flex items-center justify-center -mt-8 mb-2">
                  <span className="w-8 h-8 rounded-full bg-champagne-500 text-wine-950 flex items-center justify-center border-2 border-[#FAF5EE] shadow-sm">
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

            {/* Scroll Down Indicator */}
            <div className="pb-2 flex flex-col items-center justify-center opacity-75">
              <span className="text-[10px] font-cinzel tracking-[0.25em] uppercase text-champagne-700 mb-1.5 font-semibold">
                Scroll to View Invitation ♡
              </span>
              <div className="w-5 h-8 rounded-full border border-champagne-500 flex items-start justify-center p-1">
                <span className="w-1.5 h-2.5 bg-champagne-600 rounded-full animate-bounce" />
              </div>
            </div>
          </section>

          {/* HEADER SECTION */}
          <header className="relative pt-12 pb-8 px-6 text-center bg-gradient-to-b from-[#FAF2E6] via-[#FAF5EE] to-[#FAF5EE]">
            
            {/* Monogram Crest */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-champagne-500 flex items-center justify-center bg-gradient-to-br from-wine-950 to-wine-900 shadow-md">
              <span className="font-cinzel text-base tracking-widest text-champagne-300 font-bold">
                {coupleInitials}
              </span>
            </div>

            <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-champagne-700 font-bold mb-1">
              The Walima &amp; Reception Banquet
            </p>

            <p className="font-cormorant italic text-sm text-wine-900/80 mb-2">
              Together with their families, cordially invite you to celebrate the union of
            </p>

            {/* Optional Regal Urdu Calligraphy */}
            <UrduCalligraphyHeader data={data} className="text-wine-900" />

            {/* Couple Names */}
            <h1 className="font-script text-5xl sm:text-6xl text-wine-950 leading-tight my-1">
              {groomName}
            </h1>
            <div className="flex items-center justify-center gap-3 my-1">
              <span className="h-0.5 w-10 bg-champagne-400" />
              <span className="font-cormorant italic text-2xl text-champagne-600 font-bold">&amp;</span>
              <span className="h-0.5 w-10 bg-champagne-400" />
            </div>
            <h1 className="font-script text-5xl sm:text-6xl text-wine-950 leading-tight">
              {brideName}
            </h1>

            {/* COUPLE HERO (Royal Arched Oval Silhouette Frame) */}
            {heroImage && (
              <div className="relative w-64 sm:w-72 mx-auto my-6 rounded-t-full rounded-b-2xl border-2 border-champagne-500/60 p-2 shadow-xl bg-gradient-to-b from-champagne-100/70 via-white to-champagne-100/40">
                <div className="w-full aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden relative shadow-inner bg-[#F5EADF]">
                  <img
                    src={heroImage}
                    alt={`${groomName} & ${brideName} Reception`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-t-full rounded-b-xl ring-1 ring-inset ring-champagne-500/40 pointer-events-none" />
                </div>
                <div className="mt-2 text-center">
                  <span className="font-cinzel text-[10px] tracking-[0.25em] text-wine-900/80 uppercase font-semibold flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-champagne-600" />
                    <span>A Black-Tie Celebration of Love</span>
                  </span>
                </div>
              </div>
            )}

            {/* Date Ribbon */}
            <div className="mt-2 inline-block px-5 py-2 rounded-full bg-gradient-to-r from-wine-950 via-wine-900 to-wine-950 text-champagne-200 border border-champagne-500/50 shadow-md">
              <p className="font-cinzel text-xs tracking-widest uppercase font-bold">
                {eventDateDisplay}
              </p>
            </div>
            <p className="font-cormorant italic text-sm text-wine-900/90 mt-2 font-medium">
              {eventTimeDisplay} &bull; {cityDisplay}
            </p>
          </header>

          {/* COUNTDOWN */}
          <section className="py-6 px-6 text-center bg-gradient-to-b from-[#FAF5EE] to-[#F5EBDD]">
            <span className="font-cinzel text-[10px] tracking-widest uppercase text-champagne-700 font-bold block mb-1">
              Save The Date
            </span>
            <h2 className="font-serif text-2xl text-wine-950 font-bold mb-3">Awaiting Your Gracious Company</h2>
            <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-champagne-400/40 shadow-sm">
                <span className="font-serif text-2xl font-bold text-wine-950">{timeLeft.days}</span>
                <span className="font-cinzel text-[9px] uppercase block text-wine-800/70">Days</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-champagne-400/40 shadow-sm">
                <span className="font-serif text-2xl font-bold text-wine-950">{timeLeft.hours}</span>
                <span className="font-cinzel text-[9px] uppercase block text-wine-800/70">Hours</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-champagne-400/40 shadow-sm">
                <span className="font-serif text-2xl font-bold text-wine-950">{timeLeft.minutes}</span>
                <span className="font-cinzel text-[9px] uppercase block text-wine-800/70">Mins</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-champagne-400/40 shadow-sm">
                <span className="font-serif text-2xl font-bold text-champagne-600">{timeLeft.seconds}</span>
                <span className="font-cinzel text-[9px] uppercase block text-wine-800/70">Secs</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleAddToCalendar}
                className="inline-flex items-center gap-1.5 text-xs font-cinzel text-wine-900 hover:text-wine-700 uppercase font-semibold"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-champagne-600" />
                Add to Google Calendar
              </button>
            </div>
          </section>

          {/* ITINERARY */}
          <section className="py-8 px-6">
            <h2 className="font-serif text-2xl text-wine-950 font-bold text-center mb-6">
              Reception Evening Program
            </h2>
            <div className="space-y-4">
              {schedule.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/90 border border-champagne-400/40 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-cinzel text-xs font-bold text-champagne-600">{item.time}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-champagne-100 text-wine-900 font-medium font-sans">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-wine-950">{item.title}</h3>
                  <p className="font-sans text-xs text-wine-900/70 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* VENUE */}
          <section className="py-6 px-6 bg-[#FAF5EE]">
            <div className="bg-white rounded-2xl border border-champagne-500/40 overflow-hidden shadow-sm">
              {venueImage && (
                <div className="h-44 bg-wine-950 relative overflow-hidden">
                  <img src={venueImage} alt={venueName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-serif text-xl text-white font-bold">{venueName}</h3>
                  </div>
                </div>
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-champagne-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-wine-900">{venueAddress}</p>
                </div>
                <a
                  href={venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-wine-950 to-wine-900 text-champagne-200 font-cinzel text-xs uppercase font-bold tracking-wider py-3 rounded-xl shadow-sm transition-all"
                >
                  <Navigation className="w-4 h-4 text-champagne-400" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </section>

          {/* CHERISHED WALIMA FAMILY & GUESTS SECTION */}
          {familyImage && (
            <section className="py-8 px-6 text-center bg-gradient-to-b from-[#FAF5EE] via-[#F6ECE0] to-[#FAF5EE] border-t border-champagne-400/30">
              <div className="max-w-xs sm:max-w-sm mx-auto mb-3">
                <span className="font-cinzel text-[10px] tracking-widest uppercase text-champagne-700 font-bold block mb-1">
                  — The Walima Dawat &bull; Family Gathering —
                </span>
                <h2 className="font-serif text-2xl font-bold text-wine-950 mb-2">
                  Cherished Family &amp; Loved Ones
                </h2>
                <p className="font-sans text-xs text-wine-900/80 leading-relaxed">
                  &ldquo;Joined together with the blessings and boundless love of both our families, parents, siblings, and cousins whose presence illuminates our lives.&rdquo;
                </p>
              </div>

              <div className="relative w-full max-w-sm mx-auto my-4 rounded-2xl border-2 border-champagne-500/70 p-2 shadow-xl bg-white">
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden relative shadow-inner bg-[#F5EADF]">
                  <img
                    src={familyImage}
                    alt="Walima Family Gathering"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-champagne-500/30 rounded-xl pointer-events-none" />
                </div>
              </div>

              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-wine-950 text-champagne-200 text-[10px] font-cinzel uppercase font-bold tracking-wider shadow-sm border border-champagne-500/40">
                  <Sparkles className="w-3 h-3 text-champagne-400" />
                  <span>With Best Compliments from Both Families</span>
                </span>
              </div>
            </section>
          )}

          {/* RSVP BANNER */}
          <section className="py-8 px-6 text-center bg-gradient-to-r from-wine-950 to-wine-900 text-champagne-100">
            <h2 className="font-serif text-2xl font-bold mb-1">Kindly Honor Us With Your Presence</h2>
            <p className="font-sans text-xs text-champagne-200/80 mb-5">
              Please RSVP to assist with seating and dinner arrangements.
            </p>
            <button
              onClick={() => setRsvpOpen(true)}
              className="w-full py-3.5 rounded-xl bg-champagne-500 hover:bg-champagne-400 text-wine-950 font-cinzel text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-95"
            >
              Respond to RSVP
            </button>
          </section>

          {/* SECTION 7: SUNNAH DUA & FOOTER */}
          <footer className="pt-8 pb-14 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FAF5EE] via-[#F5EADF] to-[#E9D9C5]">
            <div className="max-w-xs mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-wine-950 font-bold mb-2">We Eagerly Await You!</h2>

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

              <p className="font-cormorant italic text-base text-wine-900/80 mb-2">
                With love, prayers &amp; eternal gratitude,
              </p>
              <p className="font-script text-4xl sm:text-5xl text-wine-950 mb-6">
                {groomName.split(' ')[0]} &amp; {brideName.split(' ')[0]}
              </p>

              <p className="text-[10px] font-cinzel tracking-[0.25em] text-champagne-700 uppercase font-semibold">
                {hashtag}
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* RSVP MODAL */}
      {rsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#FAF5EE] rounded-3xl border border-champagne-500 p-6 text-wine-950 shadow-2xl">
            <button onClick={() => setRsvpOpen(false)} className="absolute top-4 right-4 p-1 text-wine-900/60">
              <X className="w-5 h-5" />
            </button>
            {rsvpSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-serif text-xl font-bold">Thank You For Your RSVP</h3>
                <p className="text-xs text-wine-900/80 mt-1">We look forward to celebrating together!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-center">RSVP for Walima Reception</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1">Guest Name(s)</label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    placeholder="e.g. Mr. & Mrs. Tariq"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne-400 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Attendance</label>
                  <select
                    value={rsvpForm.attendance}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne-400 focus:outline-none bg-white"
                  >
                    <option value="attending">Accept with Pleasure</option>
                    <option value="declined">Regretfully Decline</option>
                  </select>
                </div>
                <button
                  onClick={async () => {
                    setRsvpSubmitted(true);
                    try {
                      if (invitationId) {
                        await submitRsvp({
                          invitation_id: invitationId,
                          guest_name: rsvpForm.name || 'Anonymous Guest',
                          attendance: rsvpForm.attendance || 'attending',
                          guest_count: 2,
                        });
                      }
                    } catch (err) {
                      console.error('RSVP submit error:', err);
                    }
                    setTimeout(() => { setRsvpOpen(false); setRsvpSubmitted(false); }, 2000);
                  }}
                  className="w-full py-3 rounded-xl bg-wine-950 text-champagne-200 font-cinzel text-xs uppercase font-bold shadow-md"
                >
                  Send Confirmation
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUDIO TOGGLE */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-wine-950 text-champagne-300 border border-champagne-500/50 shadow-xl"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

    </div>
  );
}
