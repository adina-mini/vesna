'use client';

import React, { useState, useEffect } from 'react';
import { Lock, EyeOff, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';
import IntroGate from '@/components/IntroGate';

/**
 * SampleCardShowcase - CRITICAL REQUIREMENT ENFORCER
 * 
 * STRICT ARCHITECTURAL RULE:
 * This component NEVER receives, accesses, or binds to the customer's form inputs or uploaded photos.
 * It strictly renders the original template's static sampleData with its signature opening reveal
 * so customers see the entire guest experience (opening ring -> card reveal) right inside the preview pane.
 */
export default function SampleCardShowcase({ template }) {
  if (!template) return null;

  const [cardRevealed, setCardRevealed] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // Re-trigger opening animation whenever customer switches template
  useEffect(() => {
    setCardRevealed(false);
  }, [template.id]);

  const TemplateComponent = template.Component;
  const sampleData = template.sampleData || {};

  const introArtwork =
    sampleData.intro_image ||
    sampleData.hero_image ||
    '/assets/couple-golden-intro.jpg';

  const title =
    sampleData.bride_name && sampleData.groom_name
      ? `${sampleData.bride_name} & ${sampleData.groom_name}`
      : sampleData.event_title || template.name;

  const subtitle =
    sampleData.event_subtitle ||
    sampleData.event_date_display ||
    'Sample Experience Preview';

  return (
    <div className="w-full flex flex-col items-center">
      {/* Educational Banner with Replay Control */}
      <div className="w-full max-w-[460px] mb-5 p-4 rounded-[28px] bg-paper border border-sand-300/90 text-espresso shadow-atelier">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-sand-100 text-olive flex-shrink-0 mt-0.5 border border-sand-200">
            <Lock className="w-4 h-4 text-olive" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-espresso">
                  Live Sample Experience
                </span>
                <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-sand-100 text-espresso/75 border border-sand-300 uppercase font-semibold">
                  Royal Reveal
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCardRevealed(false);
                  setReplayKey((k) => k + 1);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-espresso hover:bg-espresso-dark text-paper text-[10px] font-sans font-semibold uppercase tracking-wider shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-gold-500/20"
              >
                <RotateCcw className="w-3 h-3 text-sand-300" />
                <span>Replay Reveal</span>
              </button>
            </div>
            <p className="font-sans text-[11px] text-espresso/70 leading-relaxed">
              This interactive frame previews the full guest experience (royal opening ring &rarr; card reveal). Your personalized text and portraits will appear upon clicking <strong>Publish</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* RENDER ORIGINAL SAMPLE WITH LUXURY DEVICE BEZEL */}
      <div
        className={`w-full max-w-[460px] relative pointer-events-auto rounded-[40px] border-2 border-sand-300/80 bg-paper shadow-2xl transition-all duration-700 overflow-hidden ${
          cardRevealed
            ? 'h-auto'
            : 'h-[680px]'
        }`}
      >
        {/* Scoped Right-Side Intro Gate */}
        <IntroGate
          key={`${template.id}-${replayKey}`}
          artwork={introArtwork}
          title={title}
          subtitle={subtitle}
          palette={template.palette}
          isContained={true}
          showReplayButton={false}
          onFinish={() => setCardRevealed(true)}
        />

        {/* Card Component underneath with smooth reveal */}
        <div
          className={`w-full transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            cardRevealed
              ? 'opacity-100 scale-100 filter-none'
              : 'opacity-0 scale-[0.985] blur-[1px]'
          }`}
        >
          <TemplateComponent data={sampleData} isSample={true} suppressIntro={true} />
        </div>
      </div>
    </div>
  );
}
