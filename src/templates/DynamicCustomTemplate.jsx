'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Clock,
  MapPin,
  Navigation,
  CalendarPlus,
  Users,
  Utensils,
  Hourglass,
  CheckCircle2,
  X
} from 'lucide-react';
import { submitRsvp } from '@/lib/supabase';

export default function DynamicCustomTemplate({
  data,
  isSample = false,
  invitationId,
  suppressIntro = false,
  templateConfig = {},
}) {
  // Config & Palette
  const palette = templateConfig?.palette || ['#26060A', '#D4AF37', '#FAF5EF'];
  const primaryColor = palette[0] || '#26060A';
  const goldColor = palette[1] || '#D4AF37';
  const bgCanvas = palette[2] || '#FAF5EF';
  const themeStyle = templateConfig?.themeStyle || 'royal-arch';

  // Normalize host data with fallbacks
  const sample = templateConfig?.sampleData || {};
  const brideName = data?.bride_name || sample.bride_name || 'Fatima Noor';
  const groomName = data?.groom_name || sample.groom_name || 'Sharjeel Khan';
  const coupleInitials =
    data?.couple_initials ||
    (brideName[0] && groomName[0] ? `${brideName[0]} & ${groomName[0]}` : 'F & S');
  const eventTitle = data?.event_title || sample.event_title || templateConfig?.name || 'Wedding Celebration';
  const eventSubtitle = data?.event_subtitle || sample.event_subtitle || 'The Celebration of Love & Union';
  const eventDateIso = data?.event_date_iso || sample.event_date_iso || '2026-11-20T18:00:00';
  const eventDateDisplay = data?.event_date_display || sample.event_date_display || 'Saturday • November 20, 2026';
  const eventTimeDisplay = data?.event_time_display || sample.event_time_display || "Six O'Clock in the Evening";
  const cityDisplay = data?.city_display || sample.city_display || 'Lahore, Pakistan';
  const venueName = data?.venue_name || sample.venue_name || 'The Grand Palm Royale';
  const venueAddress = data?.venue_address || sample.venue_address || 'Canal Bank Road, Lahore, Punjab, Pakistan';
  const venueMapUrl = data?.venue_map_url || sample.venue_map_url || 'https://maps.google.com';
  const hashtag = data?.hashtag || sample.hashtag || '#VESNALUXURY2026';

  // Media
  const heroImage = data?.hero_image || sample.hero_image || '/assets/couple-hero.jpg';
  const venueImage = data?.venue_image || sample.venue_image || '/assets/barat-stage-venue.jpg';

  // Schedule
  const schedule = data?.schedule || sample.schedule || [
    { time: '6:00 PM', tag: 'Arrival', title: 'Guest Reception', desc: 'Welcome refreshments and gathering of cherished family.', icon: 'users' },
    { time: '7:30 PM', tag: 'Ceremony', title: 'Solemn Ceremony & Vows', desc: 'Heartfelt ceremony and Quranic prayers for the couple.', icon: 'heart', highlight: true },
    { time: '9:00 PM', tag: 'Feast', title: 'Royal Luncheon / Dinner', desc: 'A rich culinary feast, confectionery, and celebrations.', icon: 'utensils' },
    { time: '11:00 PM', tag: 'Farewell', title: 'Rukhsati & Blessings', desc: 'Emotional sendoff with sincere family prayers.', icon: 'sparkles' },
  ];

  // RSVP state
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', guests: '2', attendance: 'attending', notes: '', phone: '' });

  // Countdown
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

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

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;

    if (invitationId && !isSample) {
      await submitRsvp({
        invitation_id: invitationId,
        guest_name: rsvpForm.name,
        guest_phone: rsvpForm.phone,
        attendance: rsvpForm.attendance,
        guest_count: parseInt(rsvpForm.guests, 10) || 1,
        notes: rsvpForm.notes,
      });
    }

    setRsvpSubmitted(true);
    setTimeout(() => {
      setRsvpOpen(false);
      setRsvpSubmitted(false);
    }, 2800);
  };

  // Determine dark vs light canvas
  const isDarkCanvas = primaryColor.startsWith('#0') || primaryColor.startsWith('#1') || primaryColor.startsWith('#2');

  return (
    <div
      className="min-h-screen relative font-serif overflow-x-hidden selection:bg-gold-500/30 selection:text-espresso"
      style={{ backgroundColor: bgCanvas, color: isDarkCanvas ? '#FAF5EF' : '#1A1A1A' }}
    >
      {/* Background Ambience & Noise */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(${goldColor}22 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Suite Container */}
      <div className="relative z-10 max-w-xl mx-auto px-4 py-8 sm:py-14 space-y-12">
        {/* ========================================================= */}
        {/* 1. ATELIER BANNER & DEDICATION                            */}
        {/* ========================================================= */}
        <header className="text-center space-y-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-[0.3em] font-semibold shadow-xs"
            style={{
              backgroundColor: `${goldColor}15`,
              color: goldColor,
              border: `1px solid ${goldColor}40`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: goldColor }} />
            <span>{templateConfig?.badge || 'Atelier Bespoke Edition'}</span>
          </div>

          {/* Quranic / Classical Blessing */}
          <div className="py-2">
            <p
              className="text-lg sm:text-2xl font-normal tracking-wide text-center select-none"
              style={{ color: goldColor }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p
              className="font-sans text-[11px] sm:text-xs tracking-[0.25em] uppercase mt-2 opacity-75"
              style={{ color: isDarkCanvas ? '#E2DCD5' : '#4A3E39' }}
            >
              In the Name of Allah, Most Gracious, Most Merciful
            </p>
          </div>

          {/* Monogram Seal */}
          <div className="flex justify-center my-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg relative border"
              style={{
                backgroundColor: primaryColor,
                borderColor: `${goldColor}80`,
                boxShadow: `0 0 25px ${goldColor}30`,
              }}
            >
              <div
                className="absolute inset-1 rounded-full border border-dashed opacity-40"
                style={{ borderColor: goldColor }}
              />
              <span
                className="font-serif text-xl sm:text-2xl font-bold tracking-widest"
                style={{ color: goldColor }}
              >
                {coupleInitials}
              </span>
            </div>
          </div>

          {/* Couple Names */}
          <div className="space-y-2 pt-2">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-none"
              style={{ color: isDarkCanvas ? '#FAF5EF' : primaryColor }}
            >
              <span className="block">{brideName}</span>
              <span
                className="block text-2xl sm:text-3xl my-1 italic font-light font-serif"
                style={{ color: goldColor }}
              >
                &amp;
              </span>
              <span className="block">{groomName}</span>
            </h1>

            <p
              className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase font-medium pt-3"
              style={{ color: goldColor }}
            >
              {eventTitle}
            </p>
            <p
              className="font-sans text-xs opacity-75"
              style={{ color: isDarkCanvas ? '#C7BFB5' : '#6A5F58' }}
            >
              {eventSubtitle}
            </p>
          </div>
        </header>

        {/* ========================================================= */}
        {/* 2. HERO PORTRAIT WITH ARCHED FRAME                         */}
        {/* ========================================================= */}
        <section className="relative mx-auto max-w-sm sm:max-w-md">
          <div
            className="p-3 sm:p-4 rounded-t-[100px] rounded-b-3xl shadow-2xl relative border"
            style={{
              backgroundColor: `${primaryColor}20`,
              borderColor: `${goldColor}60`,
              boxShadow: `0 15px 40px -10px ${goldColor}25`,
            }}
          >
            <div className="overflow-hidden rounded-t-[90px] rounded-b-2xl aspect-[3/4] relative bg-stone-900">
              <img
                src={heroImage}
                alt={`${brideName} & ${groomName}`}
                className="w-full h-full object-cover object-center filter contrast-[1.03]"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${primaryColor}cc 0%, transparent 40%)`,
                }}
              />
            </div>

            {/* Arched Crest Accent */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-sans font-bold tracking-[0.2em] uppercase shadow-md flex items-center gap-1.5 border"
              style={{
                backgroundColor: primaryColor,
                color: goldColor,
                borderColor: goldColor,
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>{cityDisplay}</span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. EVENT DATE & REALTIME COUNTDOWN                         */}
        {/* ========================================================= */}
        <section
          className="p-6 sm:p-8 rounded-3xl text-center space-y-6 border shadow-xl relative overflow-hidden"
          style={{
            backgroundColor: `${primaryColor}15`,
            borderColor: `${goldColor}40`,
          }}
        >
          <div>
            <span
              className="font-sans text-[11px] uppercase tracking-[0.25em] font-semibold block mb-2"
              style={{ color: goldColor }}
            >
              Date &amp; Auspicious Hour
            </span>
            <h2
              className="text-2xl sm:text-3xl font-normal"
              style={{ color: isDarkCanvas ? '#FAF5EF' : primaryColor }}
            >
              {eventDateDisplay}
            </h2>
            <p
              className="font-sans text-xs sm:text-sm mt-1 opacity-80"
              style={{ color: isDarkCanvas ? '#E2DCD5' : '#4A3E39' }}
            >
              {eventTimeDisplay}
            </p>
          </div>

          {/* Realtime Countdown Clock */}
          <div className="pt-2 border-t border-dashed" style={{ borderColor: `${goldColor}30` }}>
            <span
              className="font-sans text-[10px] uppercase tracking-[0.25em] font-medium block mb-4"
              style={{ color: goldColor }}
            >
              Counting Down to the Celebration
            </span>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xs mx-auto">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 sm:p-3 rounded-2xl border flex flex-col items-center justify-center shadow-xs"
                  style={{
                    backgroundColor: `${primaryColor}40`,
                    borderColor: `${goldColor}40`,
                  }}
                >
                  <span
                    className="font-serif text-xl sm:text-2xl font-bold leading-none"
                    style={{ color: goldColor }}
                  >
                    {item.value}
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-wider mt-1 opacity-70">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. CELEBRATION ITINERARY TIMELINE                         */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span
              className="font-sans text-[11px] uppercase tracking-[0.25em] font-semibold"
              style={{ color: goldColor }}
            >
              Order of Ceremonies
            </span>
            <h3
              className="text-2xl sm:text-3xl font-normal"
              style={{ color: isDarkCanvas ? '#FAF5EF' : primaryColor }}
            >
              Celebration Itinerary
            </h3>
          </div>

          <div className="space-y-4">
            {schedule.map((item, index) => (
              <div
                key={index}
                className={`p-5 rounded-2xl border transition-all duration-300 relative ${
                  item.highlight ? 'shadow-lg ring-1' : 'shadow-xs'
                }`}
                style={{
                  backgroundColor: item.highlight ? `${goldColor}15` : `${primaryColor}10`,
                  borderColor: item.highlight ? goldColor : `${goldColor}30`,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${goldColor}25`,
                      color: goldColor,
                    }}
                  >
                    {item.tag || item.time}
                  </span>
                  <span
                    className="font-sans text-xs font-semibold"
                    style={{ color: goldColor }}
                  >
                    {item.time}
                  </span>
                </div>
                <h4
                  className="font-serif text-lg font-medium mb-1"
                  style={{ color: isDarkCanvas ? '#FAF5EF' : primaryColor }}
                >
                  {item.title}
                </h4>
                <p
                  className="font-sans text-xs leading-relaxed opacity-80"
                  style={{ color: isDarkCanvas ? '#D3CCC3' : '#5A4F48' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. VENUE & DIRECTIONS                                     */}
        {/* ========================================================= */}
        <section
          className="p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 text-center overflow-hidden"
          style={{
            backgroundColor: `${primaryColor}15`,
            borderColor: `${goldColor}40`,
          }}
        >
          {venueImage && (
            <div className="rounded-2xl overflow-hidden aspect-[16/9] shadow-inner bg-stone-900 relative">
              <img
                src={venueImage}
                alt={venueName}
                className="w-full h-full object-cover object-center filter brightness-95"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${primaryColor}bb 0%, transparent 60%)`,
                }}
              />
            </div>
          )}

          <div className="space-y-2">
            <span
              className="font-sans text-[11px] uppercase tracking-[0.25em] font-semibold"
              style={{ color: goldColor }}
            >
              The Venue &amp; Pavilion
            </span>
            <h3
              className="text-2xl sm:text-3xl font-normal"
              style={{ color: isDarkCanvas ? '#FAF5EF' : primaryColor }}
            >
              {venueName}
            </h3>
            <p
              className="font-sans text-xs sm:text-sm max-w-sm mx-auto opacity-80 leading-relaxed"
              style={{ color: isDarkCanvas ? '#E2DCD5' : '#4A3E39' }}
            >
              {venueAddress}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                backgroundColor: goldColor,
                color: primaryColor,
              }}
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>

            <button
              onClick={() => setRsvpOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider border transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                backgroundColor: primaryColor,
                color: goldColor,
                borderColor: goldColor,
              }}
            >
              <Heart className="w-4 h-4" />
              <span>Respond with RSVP</span>
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. ATELIER BRANDING FOOTER                                */}
        {/* ========================================================= */}
        <footer className="text-center pt-8 pb-4 space-y-3 opacity-80">
          <p
            className="font-serif text-sm tracking-widest uppercase font-semibold"
            style={{ color: goldColor }}
          >
            {hashtag}
          </p>
          <p
            className="font-sans text-[11px] tracking-wider uppercase opacity-70"
            style={{ color: isDarkCanvas ? '#B3ABA1' : '#6A5F58' }}
          >
            Crafted with Distinction by VESNA • The Invitation Atelier
          </p>
        </footer>
      </div>

      {/* ========================================================= */}
      {/* 7. RSVP MODAL                                             */}
      {/* ========================================================= */}
      {rsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6"
            style={{
              backgroundColor: isDarkCanvas ? '#150A0C' : '#FFFFFF',
              borderColor: goldColor,
              color: isDarkCanvas ? '#FAF5EF' : '#1A1A1A',
            }}
          >
            <button
              onClick={() => setRsvpOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {rsvpSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: goldColor }} />
                <h3 className="font-serif text-2xl font-bold">RSVP Received</h3>
                <p className="font-sans text-xs opacity-75">
                  Thank you for confirming your presence. The family looks forward to celebrating with you!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <span
                    className="font-sans text-[10px] uppercase tracking-[0.25em] font-semibold block"
                    style={{ color: goldColor }}
                  >
                    Guest Attendance Confirmation
                  </span>
                  <h3 className="font-serif text-2xl font-normal">Your Presence is a Blessing</h3>
                </div>

                <div>
                  <label className="font-sans text-[11px] uppercase tracking-wider block mb-1 opacity-75">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    placeholder="e.g. Tariq Mehmood & Family"
                    className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-1"
                    style={{ borderColor: `${goldColor}60` }}
                  />
                </div>

                <div>
                  <label className="font-sans text-[11px] uppercase tracking-wider block mb-1 opacity-75">
                    Contact / WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    value={rsvpForm.phone}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                    placeholder="0300 1234567"
                    className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-1"
                    style={{ borderColor: `${goldColor}60` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-sans text-[11px] uppercase tracking-wider block mb-1 opacity-75">
                      Will You Attend?
                    </label>
                    <select
                      value={rsvpForm.attendance}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border bg-stone-900 text-sm focus:outline-none"
                      style={{ borderColor: `${goldColor}60`, color: '#FAF5EF' }}
                    >
                      <option value="attending">Accepts with Pleasure</option>
                      <option value="declining">Regretfully Declines</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-sans text-[11px] uppercase tracking-wider block mb-1 opacity-75">
                      Total Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={rsvpForm.guests}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none"
                      style={{ borderColor: `${goldColor}60` }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[11px] uppercase tracking-wider block mb-1 opacity-75">
                    Warm Wishes / Dietary Notes
                  </label>
                  <textarea
                    rows={2}
                    value={rsvpForm.notes}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, notes: e.target.value })}
                    placeholder="Heartiest congratulations to the happy couple..."
                    className="w-full px-4 py-2 rounded-xl border bg-transparent text-sm focus:outline-none"
                    style={{ borderColor: `${goldColor}60` }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
                  style={{
                    backgroundColor: goldColor,
                    color: primaryColor,
                  }}
                >
                  Submit RSVP
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
