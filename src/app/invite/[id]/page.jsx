import React from 'react';
import Link from 'next/link';
import { getInvitationById } from '@/lib/supabase';
import { getTemplateById } from '@/templates/registry';
import PublicInviteWrapper from '@/components/PublicInviteWrapper';
import ClientInviteResolver from '@/components/ClientInviteResolver';
import { Lock, AlertCircle, ArrowLeft, Sparkles, Clock } from 'lucide-react';

/**
 * Dynamic OpenGraph / Social Media Metadata for WhatsApp previews
 */
export async function generateMetadata({ params }) {
  const invitation = await getInvitationById(params.id);

  if (!invitation || invitation.status !== 'published') {
    return {
      title: 'Digital Invitation | VESNA Atelier',
      description: 'You are cordially invited to celebrate with us. Tap to view your personalized digital invitation.',
      openGraph: {
        title: 'Digital Invitation | VESNA Atelier',
        description: 'You are cordially invited to celebrate with us. Tap to view your personalized digital invitation.',
        images: [
          {
            url: '/api/og?title=Digital%20Invitation&event=Celebration%20Suite&date=Honoured%20Presence&venue=VESNA%20Atelier&theme=gold',
            width: 1200,
            height: 630,
            alt: 'VESNA Digital Invitation',
          },
        ],
      },
    };
  }

  const data = invitation.data || {};

  // Resolve couple / honoree names
  let coupleTitle = 'Wedding Invitation';
  if (data.bride_name && data.groom_name) {
    coupleTitle = `${data.bride_name} & ${data.groom_name}`;
  } else if (data.child_name) {
    coupleTitle = data.child_name;
  } else if (data.honoree_name) {
    coupleTitle = data.honoree_name;
  } else if (invitation.title) {
    coupleTitle = invitation.title;
  }

  // Resolve ceremony title
  const eventTitle = data.ceremony_title || data.event_type || invitation.title || 'Grand Celebration';
  const dateStr = data.event_date_display || data.event_date || 'Upcoming Celebration';
  const venueStr = data.venue_name ? `${data.venue_name}${data.venue_city ? `, ${data.venue_city}` : ''}` : 'Special Venue';

  // Map theme based on template_id
  let themeKey = 'burgundy';
  const tId = (invitation.template_id || '').toLowerCase();
  if (tId.includes('emerald') || tId.includes('sage')) {
    themeKey = 'emerald';
  } else if (tId.includes('noir') || tId.includes('celestial') || tId.includes('midnight')) {
    themeKey = 'noir';
  } else if (tId.includes('gold') || tId.includes('mayun') || tId.includes('aqiqah')) {
    themeKey = 'gold';
  }

  const ogImageUrl = `/api/og?title=${encodeURIComponent(coupleTitle)}&event=${encodeURIComponent(eventTitle)}&date=${encodeURIComponent(dateStr)}&venue=${encodeURIComponent(venueStr)}&theme=${encodeURIComponent(themeKey)}`;

  const pageTitle = `💍 Invitation: ${coupleTitle} | VESNA`;
  const pageDesc = `✨ Warmly requesting the honour of your presence on ${dateStr} at ${venueStr}. Tap to unlock your personalized digital invitation & RSVP online.`;

  return {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `/invite/${params.id}`,
      siteName: 'VESNA Luxury Invitations',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: coupleTitle,
          type: 'image/png',
        },
      ],
      locale: 'en_PK',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: [ogImageUrl],
    },
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/png',
    },
  };
}

export default async function PublicInvitePage({ params }) {
  const invitation = await getInvitationById(params.id);

  // 1. If invitation is not found in server cache, resolve from client storage
  if (!invitation) {
    return <ClientInviteResolver invitationId={params.id} />;
  }

  // 2. Invitation is Awaiting Payment Verification (Mode A)
  if (invitation.status === 'pending_payment') {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center text-espresso">
        <div className="max-w-md p-8 rounded-3xl bg-paper border border-sand-300 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-olive/10 border border-olive/30 text-olive flex items-center justify-center mx-auto shadow-xs">
            <Clock className="w-8 h-8 text-olive animate-pulse" />
          </div>
          <span className="font-sans text-[11px] tracking-widest uppercase text-olive font-semibold block">
            Atelier Verification • Mode A
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
            Payment Verification in Progress
          </h1>
          <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed">
            The celebration suite for <strong className="text-espresso">{invitation.title}</strong> has been submitted. Our concierge is confirming the transfer. This invitation will unlock for guests immediately upon approval.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/create?edit=${invitation.id}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold uppercase tracking-wider shadow-xs"
            >
              View Order Details
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-medium uppercase tracking-wider"
            >
              Studio Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Invitation is in Unpublished Draft Status
  if (invitation.status !== 'published') {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center text-espresso">
        <div className="max-w-md p-8 rounded-3xl bg-paper border border-sand-300 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-sand-100 border border-sand-300 text-olive flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <span className="font-sans text-[11px] tracking-widest uppercase text-olive font-semibold block mb-1">
            Private Access
          </span>
          <h1 className="font-serif text-2xl font-bold text-espresso mb-2">
            Unpublished Invitation Draft
          </h1>
          <p className="font-sans text-xs sm:text-sm text-espresso/70 mb-6 leading-relaxed">
            This invitation is currently in draft mode and has not yet been published by the host. If you are the creator, please open the Customization Studio to finish and publish your card.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/create?edit=${invitation.id}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold uppercase tracking-wider shadow-xs"
            >
              Resume Editing Draft
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-medium uppercase tracking-wider"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Published Invitation -> Dynamically Render Chosen Template via PublicInviteWrapper!
  const personalizedData = invitation.data || {};

  return (
    <PublicInviteWrapper
      templateId={invitation.template_id}
      personalizedData={personalizedData}
      invitationId={invitation.id}
    />
  );
}
