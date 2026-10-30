import React from 'react';

/**
 * VESNA Luxury Brand Logo Component
 * High-fashion vector emblem featuring an architectural serif 'V'
 * crowned with a radiant 4-point gold diamond star.
 */
export default function VesnaLogo({
  size = 'md',
  showTagline = true,
  taglineText = 'The Invitation Atelier',
  variant = 'default', // 'default' | 'monogram-only' | 'wordmark-only'
  className = '',
}) {
  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base tracking-[0.22em]',
    md: 'text-lg tracking-[0.24em]',
    lg: 'text-2xl tracking-[0.26em]',
  };

  const taglineSizes = {
    sm: 'text-[8.5px]',
    md: 'text-[9.5px]',
    lg: 'text-[11px]',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {variant !== 'wordmark-only' && (
        <div
          className={`relative ${emblemSizes[size]} rounded-2xl bg-gradient-to-br from-[#faf8f5] via-[#f3ede4] to-[#e8ded2] border border-sand-300 flex items-center justify-center shadow-xs transition-all duration-300 flex-shrink-0 group-hover:border-gold-500 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]`}
        >
          {/* Bespoke Architectural V SVG Emblem */}
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 transform transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="vesnaGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFC386" />
                <stop offset="50%" stopColor="#B38F2C" />
                <stop offset="100%" stopColor="#8A6A1D" />
              </linearGradient>
              <linearGradient id="vesnaEspresso" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A241E" />
                <stop offset="100%" stopColor="#14110F" />
              </linearGradient>
            </defs>

            {/* Subtle outer diamond facet border */}
            <path
              d="M24 4 L43 24 L24 44 L5 24 Z"
              stroke="url(#vesnaGold)"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.6"
            />

            {/* Architectural Serif Letter 'V' */}
            {/* Left thick stem */}
            <path
              d="M13 13 H20.5 L24 35 L27.5 13 H35"
              stroke="none"
              fill="none"
            />
            {/* Left Serif Stem */}
            <path
              d="M14 14.5 H20.5 L24 35.5 L20 35.5 Z"
              fill="url(#vesnaEspresso)"
            />
            {/* Right Slender Serif Hairline Stem */}
            <path
              d="M24 35.5 L33.5 14.5 H30 Z"
              fill="url(#vesnaGold)"
            />
            {/* Left Serifs */}
            <rect x="13" y="13" width="7.5" height="1.6" rx="0.5" fill="url(#vesnaEspresso)" />
            {/* Right Serifs */}
            <rect x="29" y="13" width="5.5" height="1.6" rx="0.5" fill="url(#vesnaGold)" />

            {/* 4-point Radiant Diamond Star Crest atop the right apex */}
            <path
              d="M33 9.5 Q33 13 36.5 13 Q33 13 33 16.5 Q33 13 29.5 13 Q33 13 33 9.5 Z"
              fill="url(#vesnaGold)"
            />
            <circle cx="33" cy="13" r="0.9" fill="#FFF" />
          </svg>

          {/* Micro gold shimmer dot */}
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold-500 ring-2 ring-paper shadow-xs" />
        </div>
      )}

      {variant !== 'monogram-only' && (
        <div className="text-left">
          <span
            className={`font-serif font-semibold text-espresso block leading-tight tracking-[0.24em] ${titleSizes[size]}`}
          >
            VESNA
          </span>
          {showTagline && (
            <span
              className={`font-sans uppercase tracking-[0.22em] text-olive font-semibold block mt-0.5 ${taglineSizes[size]}`}
            >
              {taglineText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

