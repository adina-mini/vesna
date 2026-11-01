'use client';

import React, { useState } from 'react';
import IntroGate from '@/components/IntroGate';
import { getTemplateById } from '@/templates/registry';

export default function PublicInviteWrapper({ template: initialTemplate, templateId, personalizedData = {}, invitationId }) {
  const [cardRevealed, setCardRevealed] = useState(false);

  const template = initialTemplate?.Component
    ? initialTemplate
    : getTemplateById(templateId || initialTemplate?.id);

  if (!template || !template.Component) return null;
  const TemplateComponent = template.Component;

  // Determine intro artwork tailored to the event (signature gold emblem)
  const introArtwork =
    personalizedData?.intro_image ||
    template?.sampleData?.intro_image ||
    personalizedData?.hero_image ||
    template?.sampleData?.hero_image ||
    '/assets/couple-golden-intro.jpg';

  // Determine couple / honoree names for the intro
  const title =
    personalizedData?.bride_name && personalizedData?.groom_name
      ? `${personalizedData.bride_name} & ${personalizedData.groom_name}`
      : personalizedData?.event_title || template.name;

  const subtitle =
    personalizedData?.event_subtitle ||
    personalizedData?.event_date_display ||
    'You are cordially invited';

  return (
    <div className="relative min-h-screen">
      {/* 1. Cinematic Opening Intro Gate */}
      <IntroGate
        artwork={introArtwork}
        title={title}
        subtitle={subtitle}
        palette={template.palette}
        showReplayButton={true}
        onFinish={() => setCardRevealed(true)}
      />

      {/* 2. Invitation Card with smooth luxury scale/fade reveal */}
      <div
        className={`w-full min-h-screen transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          cardRevealed
            ? 'opacity-100 scale-100 filter-none'
            : 'opacity-0 scale-[0.985] blur-[1px]'
        }`}
      >
        <TemplateComponent
          data={personalizedData}
          isSample={false}
          invitationId={invitationId}
          suppressIntro={true}
        />
      </div>
    </div>
  );
}
