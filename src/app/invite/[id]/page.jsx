import React from 'react';
import Link from 'next/link';
import { getInvitationById } from '@/lib/supabase';
import { getTemplateById } from '@/templates/registry';
import PublicInviteWrapper from '@/components/PublicInviteWrapper';
import { Lock, AlertCircle, ArrowLeft, Sparkles, Clock } from 'lucide-react';

/**
 * Dynamic OpenGraph / Social Media Metadata for WhatsApp previews
 */
export async function generateMetadata({ params }) {
  const invitation = await getInvitationById(params.id);

  if (!invitation || invitation.status !== 'published') {
    return {
      title: 'Digital Wedding Invitation',
      description: 'You are cordially invited to celebrate with us.',
    };
  }

  const data = invitation.data || {};
  const title = data.bride_name && data.groom_name
    ? `Wedding Invitation | ${data.bride_name} & ${data.groom_name}`
    : invitation.title || 'Digital Invitation';
  const desc = data.event_date_display && data.venue_name
    ? `Warmly inviting you to celebrate on ${data.event_date_display} at ${data.venue_name}.`
    : 'View our personalized digital invitation.';

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: [
        {
          url: data.hero_image || '/assets/couple-hero.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function PublicInvitePage({ params }) {
  const invitation = await getInvitationById(params.id);

  // 1. Invitation does not exist
  if (!invitation) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center text-espresso">
        <div className="max-w-md p-8 rounded-3xl bg-paper border border-sand-300 shadow-xl">
          <AlertCircle className="w-12 h-12 text-olive mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-espresso mb-2">Invitation Not Found</h1>
          <p className="font-sans text-xs sm:text-sm text-espresso/70 mb-6 leading-relaxed">
            The invitation link you opened is invalid or may have been removed by the host. Please check the URL and try again.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold uppercase tracking-wider shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-sand-300" />
            <span>Return to Studio Home</span>
          </Link>
        </div>
      </div>
    );
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

  // 3. Published Invitation -> Dynamically Render Chosen Template via PublicInviteWrapper!
  const template = getTemplateById(invitation.template_id);
  const personalizedData = invitation.data || {};

  return (
    <PublicInviteWrapper
      template={template}
      personalizedData={personalizedData}
      invitationId={invitation.id}
    />
  );
}
