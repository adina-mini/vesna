'use client';

import React from 'react';

/**
 * Regal Urdu Nastaliq Calligraphy Block
 * 100% Optional: renders only if data.enable_urdu_calligraphy === true
 */
export default function UrduCalligraphyHeader({ data = {}, className = '' }) {
  if (!data?.enable_urdu_calligraphy) {
    return null;
  }

  const {
    urdu_ceremony_preset,
    urdu_couple_names,
    urdu_hosts,
    urdu_bismillah = true,
  } = data;

  const hasAnyContent = Boolean(
    urdu_ceremony_preset || urdu_couple_names || urdu_hosts || urdu_bismillah
  );

  if (!hasAnyContent) {
    return null;
  }

  return (
    <div
      dir="rtl"
      className={`my-4 sm:my-6 px-4 py-3 text-center transition-all animate-in fade-in duration-500 ${className}`}
    >
      {/* Decorative Golden Arch Flourish */}
      <div className="flex items-center justify-center gap-2 mb-2 opacity-80">
        <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        <span className="text-[#D4AF37] text-xs">❖</span>
        <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
      </div>

      {/* Ornate Bismillah in Nastaliq */}
      {urdu_bismillah && (
        <p className="font-nastaliq text-base sm:text-xl font-bold text-[#D4AF37] leading-loose drop-shadow-xs select-none">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      )}

      {/* Ceremonial Preset / Classic Poetic Couplet */}
      {urdu_ceremony_preset && (
        <p className="font-nastaliq text-sm sm:text-lg text-inherit opacity-90 font-medium leading-relaxed my-1">
          {urdu_ceremony_preset}
        </p>
      )}

      {/* Couple Names in Grand Nastaliq */}
      {urdu_couple_names && (
        <h3 className="font-nastaliq text-2xl sm:text-3xl lg:text-4xl font-bold text-inherit leading-[2.6] my-1 drop-shadow-sm">
          {urdu_couple_names}
        </h3>
      )}

      {/* Welcoming Family Line */}
      {urdu_hosts && (
        <p className="font-nastaliq text-xs sm:text-sm text-inherit opacity-80 leading-relaxed mt-1">
          {urdu_hosts}
        </p>
      )}

      {/* Bottom Flourish */}
      <div className="flex items-center justify-center gap-2 mt-2 opacity-70">
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        <span className="text-[#D4AF37] text-[10px]">✦</span>
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
      </div>
    </div>
  );
}

