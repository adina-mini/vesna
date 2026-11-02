'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Calendar,
  Share2,
  CheckCircle2,
  Compass,
  ArrowRight,
  ExternalLink,
  Lock,
  Heart,
  Users,
  ShieldCheck,
  Check
} from 'lucide-react';

const PREVIEW_THEMES = {
  barat: {
    id: 'barat',
    tabLabel: 'Barat Ceremony',
    themeColor: 'burgundy',
    badgeText: 'Royal Velvet & Gold',
    badgeBg: 'bg-burgundy/10 text-burgundy border-burgundy/20',
    title: 'Fatima & Sharjeel',
    eventTitle: 'The Grand Barat',
    date: 'Saturday, November 7, 2026',
    time: '7:30 PM Onwards',
    venue: 'The Grand Palm Royale, Lahore',
    image: '/assets/couple-hero.jpg',
    imageAlt: 'Royal Velvet and Gold Barat Couple Portrait',
    quranVerse: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    verseRef: 'Surah Ar-Rum • 30:21',
    templateLink: '/create?template=royal-burgundy'
  },
  walima: {
    id: 'walima',
    tabLabel: 'Walima Reception',
    themeColor: 'olive',
    badgeText: 'Ivory & Golden Glow',
    badgeBg: 'bg-olive/10 text-olive border-olive/20',
    title: 'Fatima & Sharjeel',
    eventTitle: 'The Walima Reception',
    date: 'Sunday, November 8, 2026',
    time: '8:00 PM Onwards',
    venue: 'Pearl Continental Crystal Ballroom',
    image: '/assets/reception-couple.jpg',
    imageAlt: 'Noor-e-Aroosi Walima Reception Couple Portrait',
    quranVerse: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    verseRef: 'Surah Ar-Rum • 30:21',
    templateLink: '/create?template=noor-walima'
  },
  qawwali: {
    id: 'qawwali',
    tabLabel: 'Mehfil-e-Qawwali',
    themeColor: 'espresso',
    badgeText: 'Sufi Soul & Candlelight',
    badgeBg: 'bg-sand-200 text-espresso border-sand-300',
    title: 'Fatima & Sharjeel',
    eventTitle: 'Mehfil-e-Samaa & Qawwali',
    date: 'Friday, November 6, 2026',
    time: '9:00 PM Till Late',
    venue: 'Haveli Barood Khana, Walled City',
    image: '/assets/qawwali-hero.jpg',
    imageAlt: 'Qawwali Ensemble with Harmonium and Candlelit Ambiance',
    quranVerse: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    verseRef: 'Surah Ar-Rum • 30:21',
    templateLink: '/create?template=qawwali-night'
  }
};

// 12 Ambient floating gold dust particles for spatial depth
const GOLD_PARTICLES = [
  { top: '10%', left: '15%', size: '6px', delay: '0s', duration: '5.5s' },
  { top: '25%', left: '8%', size: '4px', delay: '1.2s', duration: '6.8s' },
  { top: '65%', left: '12%', size: '7px', delay: '0.8s', duration: '5.2s' },
  { top: '80%', left: '20%', size: '5px', delay: '2.1s', duration: '7.1s' },
  { top: '15%', right: '14%', size: '5px', delay: '0.4s', duration: '6.2s' },
  { top: '35%', right: '9%', size: '7px', delay: '1.8s', duration: '5.8s' },
  { top: '70%', right: '15%', size: '4px', delay: '2.5s', duration: '7.5s' },
  { top: '85%', right: '22%', size: '6px', delay: '1.0s', duration: '6.0s' },
  { top: '5%', left: '48%', size: '5px', delay: '1.5s', duration: '6.5s' },
  { top: '92%', left: '52%', size: '4px', delay: '0.7s', duration: '5.9s' },
];

export default function HeroMockup() {
  const [activeTab, setActiveTab] = useState('barat');
  const [isWaxUnsealed, setIsWaxUnsealed] = useState(false);
  const current = PREVIEW_THEMES[activeTab];

  // 3D Gyroscope / Interactive Mouse Perspective State
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState(
    'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  );
  const [lightPos, setLightPos] = useState({ x: 50, y: 30 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate natural 3D tilt angles (max +/- 10 deg)
    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setTransformStyle(
      `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
    );
    setLightPos({
      x: ((x / rect.width) * 100).toFixed(1),
      y: ((y / rect.height) * 100).toFixed(1),
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 mb-4 px-2 sm:px-4">
      {/* 3D Atmospheric Ambient Glow & Floating Gold Dust Particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[760px] h-[400px] bg-gradient-to-r from-gold-500/20 via-burgundy/15 to-sand-300/35 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Floating Gold Particles in 3D Space */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-5">
        {GOLD_PARTICLES.map((p, idx) => (
          <span
            key={idx}
            className="gold-particle"
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Interactive Theme Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
        {Object.values(PREVIEW_THEMES).map((theme) => {
          const isActive = activeTab === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => {
                setActiveTab(theme.id);
                setIsWaxUnsealed(false);
              }}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-sans uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-espresso text-paper shadow-md scale-102 ring-2 ring-espresso/20'
                  : 'bg-paper/90 text-espresso/70 hover:text-espresso hover:bg-sand-100 border border-sand-300/80 backdrop-blur-md'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive
                    ? theme.id === 'barat'
                      ? 'bg-burgundy ring-2 ring-paper'
                      : theme.id === 'walima'
                      ? 'bg-gold-500 ring-2 ring-paper'
                      : 'bg-olive ring-2 ring-paper'
                    : 'bg-sand-300'
                }`}
              />
              <span>{theme.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Main Composition: Center 3D Smartphone Frame flanked by Floating Glass Badges */}
      <div className="relative flex items-center justify-center">
        {/* ================================================================= */}
        {/* LEFT FLOATING BADGE (Desktop)                                     */}
        {/* ================================================================= */}
        <div className="hidden lg:flex flex-col gap-4 absolute -left-4 xl:-left-8 top-16 w-64 z-20 animate-fade-in">
          {/* Card 1: Quranic Verse Feature */}
          <div className="p-4 rounded-2xl bg-paper/95 backdrop-blur-md border border-sand-300/80 shadow-lg text-left transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-sand-100 flex items-center justify-center text-xs text-olive font-bold">
                📖
              </span>
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-espresso">
                Spiritual Heritage
              </span>
            </div>
            <p className="font-serif text-xs text-espresso/80 italic leading-relaxed mb-2">
              &ldquo;And He placed between your hearts affection and mercy...&rdquo;
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand-100 border border-sand-200 text-[10px] font-sans text-olive font-medium">
              <CheckCircle2 className="w-3 h-3 text-olive" />
              <span>Surah Ar-Rum • Sunnah Dua</span>
            </div>
          </div>

          {/* Card 2: Live Guest Attendance / RSVP (Replaced audio per voice skip) */}
          <div className="p-4 rounded-2xl bg-paper/95 backdrop-blur-md border border-sand-300/80 shadow-lg text-left transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-espresso">
                Live RSVP Tracking
              </span>
            </div>
            <p className="text-[11px] font-sans text-espresso/70 leading-relaxed mb-2">
              Instant guest confirmation, headcount tally, and dietary preferences synced in real-time.
            </p>
            <div className="flex items-center justify-between text-[10px] font-sans text-espresso/80 font-medium pt-1 border-t border-sand-200">
              <span className="text-olive font-semibold">184 Attending</span>
              <span className="text-espresso/50">92% Response Rate</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CENTER 3D GYROSCOPE SMARTPHONE FRAME                             */}
        {/* ================================================================= */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full max-w-[340px] sm:max-w-[380px] z-10 transition-transform duration-150 ease-out cursor-pointer will-change-transform"
          style={{ transform: transformStyle }}
        >
          {/* External Hardware Shell with 3D shadow and gold accent border */}
          <div className="relative rounded-[48px] bg-[#1a1714] p-3 sm:p-3.5 shadow-[0_30px_70px_-15px_rgba(28,24,21,0.45),0_0_45px_rgba(217,179,90,0.22)] border-2 border-sand-300/30 overflow-hidden">
            {/* Dynamic 3D Specular Light & Gold Foil Shimmer Layer */}
            <div
              className="pointer-events-none absolute inset-0 z-40 transition-opacity duration-300"
              style={{
                opacity: isHovered ? 0.38 : 0.08,
                background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(255, 235, 160, 0.75) 0%, rgba(212, 175, 55, 0.25) 35%, transparent 65%)`,
                mixBlendMode: 'color-dodge',
              }}
            />

            {/* Screen Glass Bezel */}
            <div className="relative rounded-[38px] bg-ivory overflow-hidden border border-sand-300/60 flex flex-col h-[580px] sm:h-[640px]">
              {/* Dynamic Island / Speaker Notch Bar */}
              <div className="bg-paper/90 backdrop-blur-md px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-sans text-espresso/60 border-b border-sand-200 z-30">
                <span className="font-semibold text-espresso">9:41</span>
                {/* Hardware pill */}
                <div className="w-20 h-4 bg-espresso rounded-full mx-auto flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-espresso-dark mr-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-espresso-light/40" />
                </div>
                <div className="flex items-center gap-1.5 text-espresso/80">
                  <Lock className="w-2.5 h-2.5 text-olive" />
                  <span className="text-[10px] font-mono tracking-tight text-espresso/70">vesna.atelier</span>
                </div>
              </div>

              {/* Invitation Viewport (Scrollable with hidden scrollbar for luxury app feel) */}
              <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#faf8f5]">
                {/* Interactive 3D Wax Seal Stamp at Top */}
                <div className="pt-5 pb-2 text-center">
                  <button
                    onClick={() => setIsWaxUnsealed(!isWaxUnsealed)}
                    className="inline-flex items-center gap-2 group cursor-pointer focus:outline-hidden"
                    title="Click to break or reset wax seal"
                  >
                    <div
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 shadow-md ${
                        isWaxUnsealed
                          ? 'bg-gradient-to-br from-olive/80 to-olive-dark text-paper border-olive scale-95'
                          : 'bg-gradient-to-br from-[#8A1C14] via-[#B22222] to-[#5C0600] text-sand-100 border-[#FFD700]/40 hover:scale-105 shadow-[0_4px_12px_rgba(138,28,20,0.4)]'
                      }`}
                    >
                      {isWaxUnsealed ? (
                        <Check className="w-4 h-4 text-paper animate-fade-in" />
                      ) : (
                        <span className="font-serif font-bold text-xs tracking-wider text-[#FFEDB3] drop-shadow-sm">
                          V
                        </span>
                      )}
                      <div className="absolute inset-0 rounded-full border border-sand-100/30 pointer-events-none" />
                    </div>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-espresso/70 group-hover:text-gold-600 transition-colors">
                      {isWaxUnsealed ? 'Sealed & Verified' : 'Tap Wax Seal'}
                    </span>
                  </button>
                </div>

                {/* 1. Header Architectural Floral Border */}
                <div className="pb-3 px-4 text-center">
                  {/* Event Category Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-[0.18em] font-semibold mb-3 border shadow-2xs transition-colors duration-300">
                    <Sparkles className="w-3 h-3 text-gold-500" />
                    <span className="text-espresso">{current.badgeText}</span>
                  </div>

                  {/* Quranic Bismillah */}
                  <div className="font-arabic text-sm text-gold-600 mb-1 leading-relaxed">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>

                  {/* Surah Ar-Rum Calligraphy */}
                  <div className="font-arabic text-xs text-espresso/80 px-2 leading-relaxed my-2">
                    {current.quranVerse}
                  </div>
                  <span className="font-serif text-[10px] text-espresso/60 italic tracking-wider block">
                    {current.verseRef}
                  </span>
                </div>

                {/* 2. Main Couple Title & Event Card */}
                <div className="px-4 pb-2 text-center">
                  <div className="py-2 border-y border-sand-200">
                    <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-olive font-semibold block mb-1">
                      Cordially Inviting You To
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-espresso font-normal tracking-tight">
                      {current.title}
                    </h3>
                    <span className="font-serif text-xs text-burgundy italic block mt-0.5">
                      {current.eventTitle}
                    </span>
                  </div>
                </div>

                {/* 3. Hero Visual Window (The Grand Venue Artwork) */}
                <div className="px-4 py-3">
                  <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-sand-300 shadow-sm group">
                    <img
                      src={current.image}
                      alt={current.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />

                    {/* Verified Suite Badge (Cleaned of audio) */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-paper/90 backdrop-blur-md border border-sand-300 shadow-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-olive" />
                      <span className="text-[9px] font-sans font-semibold uppercase tracking-wider text-espresso">
                        Atelier Suite
                      </span>
                    </div>

                    {/* Venue Badge on bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <div className="flex items-center gap-1.5 text-paper text-xs font-serif drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                        <span className="truncate">{current.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Live Countdown Widget */}
                <div className="px-4 py-2">
                  <div className="p-3 rounded-2xl bg-sand-100/80 border border-sand-200/80 text-center">
                    <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-olive font-semibold block mb-2">
                      Celebration Countdown
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <div className="p-1.5 rounded-xl bg-paper border border-sand-200 shadow-2xs">
                        <span className="font-serif text-base sm:text-lg font-bold text-espresso block leading-tight">
                          18
                        </span>
                        <span className="text-[8px] font-sans uppercase tracking-wider text-espresso/60">
                          Days
                        </span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-paper border border-sand-200 shadow-2xs">
                        <span className="font-serif text-base sm:text-lg font-bold text-espresso block leading-tight">
                          06
                        </span>
                        <span className="text-[8px] font-sans uppercase tracking-wider text-espresso/60">
                          Hours
                        </span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-paper border border-sand-200 shadow-2xs">
                        <span className="font-serif text-base sm:text-lg font-bold text-espresso block leading-tight">
                          42
                        </span>
                        <span className="text-[8px] font-sans uppercase tracking-wider text-espresso/60">
                          Mins
                        </span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-paper border border-sand-200 shadow-2xs">
                        <span className="font-serif text-base sm:text-lg font-bold text-burgundy block leading-tight">
                          15
                        </span>
                        <span className="text-[8px] font-sans uppercase tracking-wider text-espresso/60">
                          Secs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Date & Quick Action Buttons */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans text-espresso/80 px-1 py-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-olive" />
                      {current.date}
                    </span>
                    <span className="text-espresso/60">{current.time}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="py-2.5 px-3 rounded-xl bg-espresso text-paper text-[11px] font-sans font-semibold flex items-center justify-center gap-1.5 shadow-xs">
                      <Compass className="w-3.5 h-3.5 text-sand-300" />
                      <span>Google Maps</span>
                    </div>

                    <div className="py-2.5 px-3 rounded-xl bg-paper border border-sand-300 text-espresso text-[11px] font-sans font-semibold flex items-center justify-center gap-1.5 shadow-2xs">
                      <Share2 className="w-3.5 h-3.5 text-olive" />
                      <span>WhatsApp Share</span>
                    </div>
                  </div>
                </div>

                {/* Subtle bottom padding */}
                <div className="h-6" />
              </div>

              {/* Bottom App Navigation Glass Footer */}
              <div className="p-3 bg-paper/95 backdrop-blur-md border-t border-sand-200 flex items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[9px] font-sans uppercase tracking-wider text-espresso/60 block">
                    Interactive Preview
                  </span>
                  <span className="text-xs font-serif font-bold text-espresso">
                    {current.eventTitle}
                  </span>
                </div>

                <Link
                  href={current.templateLink}
                  className="px-4 py-2 rounded-full bg-espresso hover:bg-espresso-dark text-paper text-[11px] font-sans font-semibold uppercase tracking-wider flex items-center gap-1 shadow-xs transition-all active:scale-95"
                >
                  <span>Customize</span>
                  <ArrowRight className="w-3 h-3 text-sand-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT FLOATING BADGE (Desktop)                                    */}
        {/* ================================================================= */}
        <div className="hidden lg:flex flex-col gap-4 absolute -right-4 xl:-right-8 top-20 w-64 z-20 animate-fade-in">
          {/* Card 1: WhatsApp Guest Delivery Preview */}
          <div className="p-4 rounded-2xl bg-paper/95 backdrop-blur-md border border-sand-300/80 shadow-lg text-left transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-xs text-green-700 font-bold">
                💬
              </span>
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-espresso">
                WhatsApp Delivery
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-sand-100/70 border border-sand-200 text-[11px] font-sans text-espresso/80 leading-snug mb-2">
              &ldquo;Assalamu Alaikum Uncle! We joyfully invite you to the {current.eventTitle} celebration...&rdquo;
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand-100 border border-sand-200 text-[10px] font-sans text-green-800 font-medium">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span>Instant 1-Click Send</span>
            </div>
          </div>

          {/* Card 2: Turn-by-Turn Navigation */}
          <div className="p-4 rounded-2xl bg-paper/95 backdrop-blur-md border border-sand-300/80 shadow-lg text-left transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-sand-100 flex items-center justify-center text-olive">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-espresso">
                Venue Location
              </span>
            </div>
            <p className="text-[11px] font-sans text-espresso/70 leading-relaxed mb-2 truncate">
              {current.venue}
            </p>
            <div className="inline-flex items-center gap-1 text-[10px] font-sans text-olive font-semibold">
              <span>Opens directly in Google Maps</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Helper Cue */}
      <div className="mt-8 text-center">
        <p className="font-sans text-xs text-espresso/60 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span>Move cursor over the phone for 3D perspective • Tap tabs above to explore suites</span>
        </p>
      </div>
    </div>
  );
}
