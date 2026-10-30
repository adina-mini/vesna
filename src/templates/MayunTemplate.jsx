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
  Flower2,
  Sun
} from 'lucide-react';
import { submitRsvp } from '@/lib/supabase';
import IntroGate from '../components/IntroGate';

export default function MayunTemplate({ data, isSample = false, invitationId, suppressIntro = false }) {
  const brideName = data?.bride_name || "Ayesha Noor";
  const groomName = data?.groom_name || "Zayn Farooq";
  const eventTitle = data?.event_title || "Rasm-e-Mayun & Haldi";
  const eventSubtitle = data?.event_subtitle || "A Sacred Celebration of Pre-Wedding Glow, Ubtan & Fragrant Blessings";
  const dedication = data?.dedication || "روپ، سنگھار اور محبت کی برکتیں • Mayun ki Shubh Ghari";

  const eventDateIso = data?.event_date_iso || "2026-11-04T18:30:00";
  const eventDateDisplay = data?.event_date_display || "Wednesday • November 4, 2026";
  const eventTimeDisplay = data?.event_time_display || "Half Past Six in the Evening";
  const cityDisplay = data?.city_display || "Lahore, Pakistan";
  const venueName = data?.venue_name || "Gulberg Haveli Gardens • Lawn Pavilion";
  const venueAddress = data?.venue_address || "Canal Bank Road, Gulberg III, Lahore, Punjab, Pakistan";
  const venueMapUrl = data?.venue_map_url || "https://maps.google.com/?q=Gulberg+Lahore";
  const hashtag = data?.hashtag || "#AYESHAKIMAYUN";

  const heroImage = data?.hero_image || "/assets/mayun-bride-main.jpg";
  const settingImage = data?.setting_image || "/assets/mayun-setting-end.jpg";
  const introImage = data?.intro_image || "/assets/bridal-girl-golden-intro.jpg";
  const venueImage = data?.venue_image || "/assets/venue-hall.png";

  const schedule = data?.schedule || [
    { time: "06:30 PM", tag: "Arrival", title: "Genda Phool Istaqbaal", desc: "Welcoming with fresh motia gajras, rose water spray, and saffron lemonade.", icon: "flower2" },
    { time: "07:15 PM", tag: "Rasam", title: "Rasm-e-Ubtan & Haldi", desc: `Application of fragrant herbal ubtan for ${brideName} by loving aunts, sisters & elders.`, icon: "sparkles", highlight: true },
    { time: "08:00 PM", tag: "Blessing", title: "Tel Chadhana & Phoolon Ki Chaadar", desc: "Traditional ceremonial hair oiling and blessings under the floral canopy.", icon: "heart" },
    { time: "08:45 PM", tag: "Sangeet", title: "Mayun Tappay & Dholak Beats", desc: "Soulful traditional wedding folk songs, clapping, and cousin dance medleys.", icon: "sun", highlight: true },
    { time: "09:30 PM", tag: "Dawat", title: "Festive Mayun Feast", desc: "Authentic dawat: Dum biryani, crispy puris with halwa, reshmi tikka, and live hot jalebis.", icon: "utensils" },
  ];

  const rasamHighlights = [
    { title: "Rasm-e-Ubtan", desc: "Fragrant turmeric & sandalwood paste for bridal glow", icon: "✨" },
    { title: "Motia Gajray", desc: "Fresh hand-woven jasmine bangles for all women", icon: "🌼" },
    { title: "Mithai Khilana", desc: "Sharing traditional barfi & gulab jamun for barakah", icon: "🍯" },
    { title: "Tel Lagana", desc: "Ceremonial sweet oil blessings by dear elders", icon: "🪔" },
  ];

  const dressCode = [
    { name: "Haldi Mustard", hex: "#D98200" },
    { name: "Saffron Orange", hex: "#E65100" },
    { name: "Emerald Leaf", hex: "#165B33" },
    { name: "Motia White", hex: "#FFFDF2" },
  ];

  // Intro gate state
  const [introDismissed, setIntroDismissed] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', guests: '2', attendance: 'attending' });

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
    const title = encodeURIComponent(`${eventTitle} • ${brideName}`);
    const details = encodeURIComponent(`You are warmly invited to ${eventTitle} celebrating ${brideName}. ${eventSubtitle}`);
    const location = encodeURIComponent(`${venueName}, ${venueAddress}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`, '_blank');
  };

  return (
    <div className="bg-[#1C1204] text-[#2C1800] antialiased font-serif min-h-screen overflow-x-hidden relative selection:bg-[#E5A823]/30 selection:text-[#422200]">

      {/* Intro Gate (when not suppressed) */}
      {!suppressIntro && !introDismissed && (
        <IntroGate
          artwork={introImage}
          title={brideName}
          subtitle={eventTitle}
          onFinish={() => setIntroDismissed(true)}
          palette={['#1C1204', '#D98200', '#F7E1B5']}
        />
      )}

      {/* Sample Banner */}
      {isSample && (
        <div className="sticky top-0 z-40 bg-[#352003]/90 backdrop-blur-md border-b border-[#D98200]/40 text-[#F5B041] text-center py-2 px-4 text-xs font-sans tracking-widest uppercase">
          🌼 Sample Template Showcase &bull; Rasm-e-Mayun &amp; Haldi Ceremony
        </div>
      )}

      {/* Ambient Warm Golden Sunburst Gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#D98200]/25 via-[#E65100]/20 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[#F5B041]/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-[#165B33]/20 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 w-full min-h-screen py-0 sm:py-10 flex justify-center items-start">
        <div className="w-full sm:max-w-[480px] bg-gradient-to-b from-[#FFFDF7] via-[#FFF9ED] to-[#FFF3DC] text-[#2C1800] sm:rounded-[36px] shadow-[0_25px_90px_rgba(0,0,0,0.85)] border-0 sm:border-2 sm:border-[#D98200]/50 overflow-hidden relative">

          {/* PAGE 1: SPIRITUAL DEDICATION (BISMILLAH & SURAH AR-RUM 30:21) */}
          <section className="relative min-h-[92dvh] sm:min-h-[720px] flex flex-col justify-between items-center pt-10 pb-8 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FFFDF7] via-[#FFFDF7] to-[#FFFDF7]">
            {/* Ornate Top Header Filigree */}
            <div className="flex items-center justify-center pt-2">
              <svg className="w-36 h-7 text-[#D98200] opacity-90" viewBox="0 0 160 30" fill="currentColor">
                <path d="M80,3 C65,3 55,18 40,18 C28,18 20,8 10,15 C5,18 2,25 0,28 C10,25 22,23 35,23 C50,23 60,10 80,10 C100,10 110,23 125,23 C138,23 150,25 160,28 C158,25 155,18 150,15 C140,8 132,18 120,18 C105,18 95,3 80,3 Z" opacity="0.85" />
              </svg>
            </div>

            <div className="my-auto py-2 w-full flex flex-col items-center">
              <p className="font-amiri text-lg sm:text-xl text-[#2C1800] font-normal tracking-wide mb-5 select-none">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              {/* Quranic Verse (Surah Ar-Rum 30:21) Card */}
              <div className="max-w-xs sm:max-w-sm mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FFF5DE] to-[#FFEEC4] border border-[#D98200]/50 shadow-sm relative">
                <div className="flex items-center justify-center -mt-8 mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#D98200] text-[#FFFDF7] flex items-center justify-center border-2 border-[#FFFDF7] shadow-sm">
                    <Sparkles className="w-4 h-4 fill-current text-[#FFFDF7]" />
                  </span>
                </div>
                <p className="font-amiri text-base sm:text-lg text-[#2C1800] font-bold leading-relaxed mb-3" dir="rtl">
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
                </p>
                <div className="w-12 h-px bg-[#D98200]/60 mx-auto my-3" />
                <blockquote className="font-cormorant italic text-xs sm:text-sm text-[#874A00] leading-relaxed">
                  &ldquo;And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them, and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.&rdquo;
                </blockquote>
                <span className="inline-block mt-2.5 font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#B86A00] font-bold">
                  (Surah Ar-Rum 30:21)
                </span>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="pb-2 flex flex-col items-center justify-center opacity-75">
              <span className="text-[10px] font-cinzel tracking-[0.25em] uppercase text-[#B86A00] mb-1.5 font-semibold">
                Scroll to View Invitation ♡
              </span>
              <div className="w-5 h-8 rounded-full border border-[#D98200] flex items-start justify-center p-1">
                <span className="w-1.5 h-2.5 bg-[#D98200] rounded-full animate-bounce" />
              </div>
            </div>
          </section>

          {/* Top Marigold Garlands Filigree */}
          <div className="pt-8 pb-3 px-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D98200]/40 bg-[#FFF3DC] text-[#B86A00] text-[11px] tracking-[0.25em] uppercase font-sans font-semibold mb-3 shadow-sm">
              <Flower2 className="w-3.5 h-3.5 text-[#E65100]" />
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              <Flower2 className="w-3.5 h-3.5 text-[#E65100]" />
            </div>

            <p className="text-xs md:text-sm text-[#874A00] tracking-wide font-serif italic mt-1 font-medium">
              {dedication}
            </p>
          </div>

          {/* Hero Artwork with Golden Marigold Dome Arch */}
          <div className="px-5 py-2">
            <div className="relative w-64 sm:w-72 mx-auto rounded-t-full rounded-b-2xl border-2 border-[#D98200]/60 p-2 shadow-2xl bg-gradient-to-b from-[#FFF5DE] via-white to-[#FFEEC4]">
              <div className="w-full aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden relative shadow-inner bg-[#FFF9ED]">
                <img
                  src={heroImage}
                  alt="Mayun Haldi Bride Artwork"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-t-full rounded-b-xl ring-1 ring-inset ring-[#D98200]/40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1800]/70 via-transparent to-transparent opacity-60 pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-sans text-[#FFF8E7] tracking-wider uppercase bg-[#1C1204]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D98200]/50 shadow-md">
                  <span className="flex items-center gap-1.5 font-medium text-[#F7D070]">
                    <Flower2 className="w-3.5 h-3.5 text-[#F5B041]" />
                    Rasm-e-Ubtan
                  </span>
                  <span className="text-[#F7E1B5] text-[9px]">Bridal Glow Ritual</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#995000] uppercase font-bold">
                  Mayun Ki Shubh Ghari
                </span>
              </div>
            </div>
          </div>

          {/* Title & Bride Name */}
          <div className="text-center px-6 pt-5 pb-6">
            <div className="inline-block text-[11px] font-sans tracking-[0.3em] uppercase text-[#B86A00] font-semibold mb-1">
              Pre-Wedding Haldi Celebration
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2C1800] tracking-tight font-normal leading-tight">
              {eventTitle}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#874A00] tracking-wide font-sans">
              {eventSubtitle}
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D98200]/60" />
              <div className="text-xl sm:text-2xl font-serif text-[#995000] tracking-wider font-semibold">
                {brideName}
              </div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D98200]/60" />
            </div>

            {hashtag && (
              <div className="mt-2 text-[10px] font-sans tracking-[0.25em] uppercase text-[#B86A00]/75 font-medium">
                {hashtag}
              </div>
            )}
          </div>

          {/* Countdown Timer */}
          <div className="mx-5 mb-6 p-4 rounded-2xl bg-gradient-to-b from-[#FFF5DE] to-[#FFEEC4] border border-[#D98200]/35 text-center font-sans shadow-sm">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#995000] mb-2 font-bold flex items-center justify-center gap-1.5">
              <Clock className="w-3 h-3 text-[#D98200]" />
              Countdown to Mayun Night
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 rounded-xl bg-white/90 border border-[#D98200]/30 shadow-sm">
                <div className="text-xl sm:text-2xl font-serif text-[#7A3F00] font-bold">{timeLeft.days}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#995000] font-medium">Days</div>
              </div>
              <div className="p-2 rounded-xl bg-white/90 border border-[#D98200]/30 shadow-sm">
                <div className="text-xl sm:text-2xl font-serif text-[#7A3F00] font-bold">{timeLeft.hours}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#995000] font-medium">Hours</div>
              </div>
              <div className="p-2 rounded-xl bg-white/90 border border-[#D98200]/30 shadow-sm">
                <div className="text-xl sm:text-2xl font-serif text-[#7A3F00] font-bold">{timeLeft.minutes}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#995000] font-medium">Mins</div>
              </div>
              <div className="p-2 rounded-xl bg-white/90 border border-[#D98200]/30 shadow-sm">
                <div className="text-xl sm:text-2xl font-serif text-[#7A3F00] font-bold">{timeLeft.seconds}</div>
                <div className="text-[9px] uppercase tracking-wider text-[#995000] font-medium">Secs</div>
              </div>
            </div>
          </div>

          {/* Date & Venue Cards */}
          <div className="px-5 space-y-3 mb-6 font-sans">
            <div className="p-4 rounded-2xl bg-white/85 border border-[#D98200]/30 flex items-start gap-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#FFF3DC] border border-[#D98200]/40 text-[#D98200] shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#995000] font-bold">Date &amp; Auspicious Time</div>
                <div className="text-sm font-serif font-semibold text-[#2C1800] mt-0.5">{eventDateDisplay}</div>
                <div className="text-xs text-[#874A00] mt-0.5 font-medium">{eventTimeDisplay}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/85 border border-[#D98200]/30 flex items-start gap-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#FFF3DC] border border-[#D98200]/40 text-[#D98200] shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#995000] font-bold">Lawn &amp; Courtyard Venue</div>
                <div className="text-sm font-serif font-semibold text-[#2C1800] mt-0.5">{venueName}</div>
                <div className="text-xs text-[#874A00] mt-0.5 leading-relaxed">{venueAddress}</div>
                <div className="mt-2.5 flex items-center gap-3">
                  <a
                    href={venueMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#B86A00] hover:text-[#7A3F00] font-semibold hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Open Google Maps
                  </a>
                  <button
                    onClick={handleAddToCalendar}
                    className="inline-flex items-center gap-1.5 text-xs text-[#995000] hover:text-[#7A3F00] font-semibold hover:underline"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mayun Ritual Highlights Grid */}
          <div className="mx-5 mb-6 p-4 rounded-2xl bg-gradient-to-b from-[#FFF5DE] to-[#FFEEC4] border border-[#D98200]/35 font-sans shadow-sm">
            <div className="text-center mb-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#995000] font-bold">
                Sacred Rasams
              </div>
              <h4 className="text-sm font-serif text-[#2C1800] font-bold mt-0.5">
                Cherished Traditions of the Night
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {rasamHighlights.map((r, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white/90 border border-[#D98200]/25 shadow-xs">
                  <div className="text-base mb-1">{r.icon}</div>
                  <div className="text-xs font-serif font-bold text-[#2C1800]">{r.title}</div>
                  <div className="text-[10px] text-[#874A00] mt-0.5 leading-tight">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Program Schedule */}
          <div className="px-5 mb-6 font-sans">
            <div className="text-center mb-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#995000] font-bold">
                Order of Celebrations
              </div>
              <h3 className="text-lg font-serif text-[#2C1800] font-medium mt-0.5">
                Mayun Evening Program
              </h3>
            </div>

            <div className="space-y-2.5">
              {schedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.highlight
                      ? 'bg-gradient-to-r from-[#FFF0C7] via-[#FFF8E7] to-[#FFF0C7] border-[#D98200]/60 shadow-md'
                      : 'bg-white/80 border-[#D98200]/25 shadow-xs'
                  } flex items-start gap-3`}
                >
                  <div className="px-2 py-1 rounded-lg bg-[#FFF3DC] border border-[#D98200]/40 text-[11px] font-bold text-[#995000] shrink-0 mt-0.5">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-serif font-bold text-[#2C1800] flex items-center gap-1.5">
                      {item.title}
                      {item.highlight && (
                        <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-full bg-[#D98200]/20 text-[#7A3F00] border border-[#D98200]/40 uppercase tracking-wider font-semibold">
                          Highlight
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#7A3F00] mt-0.5 leading-relaxed font-medium">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Code Theme */}
          <div className="mx-5 mb-6 p-4 rounded-2xl bg-white/85 border border-[#D98200]/30 text-center font-sans shadow-sm">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#995000] font-bold mb-1">
              Dress Code Theme
            </div>
            <div className="text-xs font-serif text-[#2C1800] font-semibold mb-2.5">
              Vibrant Haldi Yellow, Saffron Orange, Fresh Leaf Green &amp; Scented Gajras
            </div>
            <div className="flex items-center justify-center gap-3">
              {dressCode.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="w-5 h-5 rounded-full border border-[#D98200]/50 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[9px] text-[#7A3F00] font-medium">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mayun Ceremonial Setting Artwork (End of Card Feature) */}
          <div className="px-5 mb-8">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#D98200]/40 shadow-xl bg-[#FFF9ED]">
              <img
                src={settingImage}
                alt="Mayun Festive Setting & Ambience"
                className="w-full h-auto object-cover max-h-[480px] transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1800]/70 via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-sans text-[#FFF8E7] tracking-wider uppercase bg-[#1C1204]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D98200]/50 shadow-md">
                <span className="flex items-center gap-1.5 font-medium text-[#F7D070]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5B041]" />
                  Mayun Ki Mehfil
                </span>
                <span className="text-[#F7E1B5] text-[10px]">Ceremonial Courtyard</span>
              </div>
            </div>
            <p className="text-center text-[11px] font-serif italic text-[#874A00] mt-2 font-medium">
              A vibrant evening of blessings, sweet ubtan, and timeless family joy
            </p>
          </div>

          {/* RSVP Floating Card */}
          <div className="mx-5 mb-8 p-5 rounded-3xl bg-gradient-to-b from-[#FFF5DE] to-[#FFEEC4] border-2 border-[#D98200]/50 text-center font-sans shadow-lg">
            <h3 className="text-base font-serif text-[#2C1800] font-bold mb-1">Kindly Respond</h3>
            <p className="text-xs text-[#874A00] mb-4 font-medium">Please confirm your presence so we can prepare your flower gajras and dinner seats.</p>

            {rsvpSubmitted ? (
              <div className="p-4 rounded-2xl bg-[#165B33]/15 border border-[#165B33]/40 text-[#165B33] flex items-center justify-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-[#165B33]" />
                Thank you! Your presence has been warmly confirmed.
              </div>
            ) : (
              <button
                onClick={() => setRsvpOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D98200] via-[#F5A623] to-[#E65100] text-white font-bold text-xs tracking-widest uppercase hover:brightness-105 shadow-md shadow-[#D98200]/30 transition-all"
              >
                RSVP for Mayun Night
              </button>
            )}
          </div>

          {/* SECTION 7: SUNNAH DUA & FOOTER */}
          <footer className="pt-8 pb-10 px-6 sm:px-8 text-center bg-gradient-to-b from-[#FFFDF7] via-[#FFF3DC] to-[#FFEEC4] border-t border-[#D98200]/30">
            <div className="max-w-xs mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1800] font-bold mb-2">We Eagerly Await You!</h2>

              <div className="my-5 p-4 rounded-2xl bg-white/90 border border-[#D98200]/45 shadow-sm text-center">
                <span className="inline-flex items-center gap-1.5 font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#B86A00] font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D98200]" />
                  A Sacred Prayer
                </span>
                <p className="font-amiri text-base sm:text-lg text-[#2C1800] font-bold leading-relaxed mb-2" dir="rtl">
                  بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                </p>
                <div className="w-10 h-0.5 bg-[#D98200]/50 mx-auto my-2" />
                <p className="font-cormorant italic text-sm sm:text-base text-[#874A00] leading-relaxed font-medium">
                  &ldquo;May Allah bless this union, bind your hearts with lifelong affection and mercy, and make your home a sanctuary of peace.&rdquo;
                </p>
              </div>

              <p className="font-cormorant italic text-base text-[#874A00] mb-2">
                With love, prayers &amp; eternal gratitude,
              </p>
              <p className="font-script text-4xl sm:text-5xl text-[#2C1800] mb-6">
                {brideName.split(' ')[0]} &amp; {groomName.split(' ')[0]}
              </p>

              <p className="text-[10px] font-cinzel tracking-[0.25em] text-[#B86A00] uppercase font-semibold mb-4">
                {hashtag}
              </p>
            </div>
          </footer>

          {/* Footer */}
          <div className="text-center pb-8 pt-2 text-[#995000]/70 text-[10px] font-sans tracking-widest uppercase border-t border-[#D98200]/20 mx-6 font-medium">
            VESNA Luxury Digital Atelier • &copy; {new Date().getFullYear()}
          </div>

        </div>
      </main>

      {/* RSVP Modal */}
      {rsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#FFFDF7] to-[#FFF4DE] rounded-3xl border-2 border-[#D98200]/50 p-6 text-[#2C1800] shadow-2xl">
            <button
              onClick={() => setRsvpOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#874A00] hover:text-[#2C1800] rounded-full hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>

            {rsvpSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-[#165B33] mx-auto mb-2" />
                <h3 className="font-serif text-lg font-bold text-[#2C1800]">Shukriya!</h3>
                <p className="text-xs text-[#874A00] mt-1">We can't wait to celebrate the Mayun festivities with you!</p>
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#995000] font-bold">RSVP</div>
                  <h3 className="font-serif text-lg text-[#2C1800] font-bold mt-0.5">{eventTitle}</h3>
                </div>

                <div>
                  <label className="block text-xs text-[#874A00] font-semibold mb-1">Your Full Name(s)</label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    placeholder="e.g. Ayesha Khan & Family"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#D98200]/40 text-[#2C1800] placeholder-[#874A00]/50 focus:outline-none focus:border-[#D98200] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#874A00] font-semibold mb-1">Number of Attending Guests</label>
                  <select
                    value={rsvpForm.guests}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#D98200]/40 text-[#2C1800] focus:outline-none focus:border-[#D98200] shadow-xs"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Family Members</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#874A00] font-semibold mb-1">Attendance Confirmation</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, attendance: 'attending' })}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        rsvpForm.attendance === 'attending'
                          ? 'bg-[#D98200] border-[#995000] text-white shadow-xs'
                          : 'bg-white border-[#D98200]/30 text-[#874A00]'
                      }`}
                    >
                      Attending with Joy
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, attendance: 'declining' })}
                      className={`py-2 rounded-xl text-xs font-medium border transition ${
                        rsvpForm.attendance === 'declining'
                          ? 'bg-[#7A3F00] border-[#4A2600] text-white'
                          : 'bg-white border-[#D98200]/30 text-[#874A00]'
                      }`}
                    >
                      Cannot Attend
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
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D98200] to-[#E65100] text-white text-xs font-bold tracking-wider uppercase hover:brightness-105 shadow-md mt-2"
                >
                  Confirm Mayun RSVP
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

