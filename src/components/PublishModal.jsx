'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  X,
  Sparkles,
  QrCode,
  Smartphone,
  Send,
  Eye
} from 'lucide-react';

export default function PublishModal({
  isOpen,
  onClose,
  invitationId,
  invitationTitle,
  invitationData = {},
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [messageTone, setMessageTone] = useState('traditional'); // 'traditional' | 'urdu' | 'modern'

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const origin = window.location.origin;
      const url = `${origin}/invite/${invitationId}`;
      setInviteUrl(url);

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#D4AF37', '#7E1727', '#FAF5EF', '#1AA272', '#CE2672'],
        });
      } catch (e) {}
    }
  }, [isOpen, invitationId]);

  if (!isOpen) return null;

  // Resolve display names
  const bride = invitationData.bride_name || 'Fatima Hafeez';
  const groom = invitationData.groom_name || 'Rao Sharjeel';
  const couple = (invitationData.bride_name && invitationData.groom_name)
    ? `${invitationData.bride_name} & ${invitationData.groom_name}`
    : (invitationTitle || 'Our Wedding Celebration');
  const date = invitationData.event_date_display || invitationData.event_date || 'Saturday, 7 November 2026';
  const venue = invitationData.venue_name
    ? `${invitationData.venue_name}${invitationData.venue_city ? `, ${invitationData.venue_city}` : ''}`
    : 'Rashid Banquet Hall, Karachi';
  const event = invitationData.ceremony_title || invitationData.event_type || 'Barat & Wedding Reception';

  // Build OG Preview image URL
  const ogPreviewUrl = `/api/og?title=${encodeURIComponent(couple)}&event=${encodeURIComponent(event)}&date=${encodeURIComponent(date)}&venue=${encodeURIComponent(venue)}&theme=burgundy`;

  // Message templates
  const messageTemplates = {
    traditional: `﷽\n\nWarmest greetings!\n\nWe warmly request the honour of your esteemed presence to celebrate the auspicious union of\n💍 *${couple}*\n\n🗓 *Date:* ${date}\n📍 *Venue:* ${venue}\n\n✨ Tap below to view your personalized interactive invitation, venue directions & RSVP:\n${inviteUrl}\n\n_Warm regards & prayers,_\n_The Families_`,
    urdu: `﷽\n\nالسلام علیکم ورحمۃ اللہ وبرکاتہ\n\nہماری دلی مسرت ہوگی اگر آپ ہماری اس خوشی میں شریک ہوں۔\n💍 *${couple}* کی شادی کا باضابطہ دعوت نامہ:\n\n🗓 *تاریخ:* ${date}\n📍 *مقام:* ${venue}\n\n✨ اپنا خصوصی ڈیجیٹل کارڈ کھولنے، لوکیشن اور شرکت کی تصدیق (RSVP) کے لیے لنک پر کلک فرمائیں:\n${inviteUrl}\n\nوالسلام،\nاہلِ خانہ`,
    modern: `✨ You are warmly invited!\n\nJoin us as we celebrate the wedding of\n*${couple}*\n\n🗓 ${date}\n📍 ${venue}\n\nTap to unveil the digital invitation & RSVP online:\n${inviteUrl}`,
  };

  const selectedMessage = messageTemplates[messageTone] || messageTemplates.traditional;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(selectedMessage)}`;

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyFormattedText = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(selectedMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  // QR Code URL
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(inviteUrl)}&color=45-35-2F&bgcolor=FAF6F0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-espresso/75 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-paper border border-sand-300 rounded-[32px] sm:rounded-[40px] shadow-2xl p-5 sm:p-8 text-espresso text-center overflow-hidden my-auto">
        {/* Subtle decorative gold glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gold-500/15 blur-[60px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-espresso/60 hover:text-espresso hover:bg-sand-100 transition-colors cursor-pointer z-10"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Medallion */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sand-100 to-sand-200 border border-sand-300 text-olive flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-gold-600 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold-500 ring-2 ring-paper" />
        </div>

        <span className="font-sans text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-olive block mb-1">
          Atelier Masterpiece Live
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-espresso mb-1.5">
          Your Invitation Is Ready to Share
        </h2>
        <p className="font-sans text-xs text-espresso/70 max-w-md mx-auto mb-4 leading-relaxed">
          When shared on WhatsApp, Facebook, or Instagram, your card automatically generates this high-resolution luxury preview card for guests.
        </p>

        {/* WHATSAPP REALISTIC SOCIAL PREVIEW BUBBLE */}
        <div className="mb-4 text-left rounded-2xl bg-[#EFEAE2] p-3 border border-sand-300 shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <span className="font-sans text-[10px] uppercase tracking-wider text-[#128C7E] font-bold flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              Live WhatsApp Social Preview Card
            </span>
            <span className="font-mono text-[10px] text-espresso/50">1200 × 630 OpenGraph</span>
          </div>

          {/* Chat Bubble Container */}
          <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-sand-200 max-w-md mx-auto">
            {/* OpenGraph Image Banner */}
            <div className="relative aspect-[1.91/1] bg-espresso overflow-hidden group">
              <img
                src={ogPreviewUrl}
                alt="Social Preview Card"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-sand-200 font-sans tracking-wide">
                HD Preview
              </div>
            </div>

            {/* Link Details Metadata */}
            <div className="p-3 bg-[#F7F7F7] border-t border-sand-200">
              <span className="text-[10px] font-sans uppercase tracking-wider text-olive font-semibold block mb-0.5">
                vesna.vercel.app
              </span>
              <h4 className="font-serif text-sm font-bold text-espresso leading-snug line-clamp-1">
                💍 Invitation: {couple} | VESNA
              </h4>
              <p className="font-sans text-[11px] text-espresso/70 line-clamp-2 mt-0.5 leading-relaxed">
                Warmly requesting the honour of your presence on {date} at {venue}. Tap to unveil your invitation & RSVP.
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGE TONE SELECTOR */}
        <div className="mb-4 text-left">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <label className="font-sans text-[11px] font-semibold text-espresso uppercase tracking-wider">
              Select WhatsApp Greeting Tone:
            </label>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-sand-100 rounded-xl border border-sand-300">
            <button
              type="button"
              onClick={() => setMessageTone('traditional')}
              className={`py-1.5 px-2 rounded-lg font-sans text-xs font-medium transition-all cursor-pointer ${
                messageTone === 'traditional'
                  ? 'bg-paper text-espresso font-semibold shadow-2xs'
                  : 'text-espresso/70 hover:text-espresso'
              }`}
            >
              👑 Royal Formal
            </button>
            <button
              type="button"
              onClick={() => setMessageTone('urdu')}
              className={`py-1.5 px-2 rounded-lg font-sans text-xs font-medium transition-all cursor-pointer ${
                messageTone === 'urdu'
                  ? 'bg-paper text-espresso font-semibold shadow-2xs'
                  : 'text-espresso/70 hover:text-espresso'
              }`}
            >
              🌸 اردو / Nastaliq
            </button>
            <button
              type="button"
              onClick={() => setMessageTone('modern')}
              className={`py-1.5 px-2 rounded-lg font-sans text-xs font-medium transition-all cursor-pointer ${
                messageTone === 'modern'
                  ? 'bg-paper text-espresso font-semibold shadow-2xs'
                  : 'text-espresso/70 hover:text-espresso'
              }`}
            >
              ✨ Modern Clean
            </button>
          </div>
        </div>

        {/* SHAREABLE LINK ROW */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-sand-50/90 border border-sand-300 flex items-center justify-between gap-2 mb-4">
          <span className="font-mono text-xs text-espresso/90 truncate select-all text-left">
            {inviteUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-gold-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Copy URL'}</span>
          </button>
        </div>

        {/* QR Code Collapsible View */}
        {showQr && (
          <div className="mb-4 p-4 rounded-2xl bg-sand-50 border border-sand-300 animate-in fade-in zoom-in-95 duration-150">
            <p className="text-[11px] font-sans text-espresso/70 mb-2.5">
              Print this high-resolution QR on your physical wedding cards or ceremony tables:
            </p>
            <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl shadow-xs border border-sand-200 flex items-center justify-center">
              <img src={qrApiUrl} alt="Invitation QR Code" className="w-full h-full object-contain" />
            </div>
          </div>
        )}

        {/* PRIMARY ACTIONS */}
        <div className="space-y-2.5">
          {/* Share on WhatsApp */}
          <a
            id="publish-whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Open in WhatsApp With Selected Greeting</span>
          </a>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleCopyFormattedText}
              className="py-2.5 px-2 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              {copiedText ? <Check className="w-3 h-3 text-olive" /> : <Copy className="w-3 h-3 text-olive" />}
              <span>{copiedText ? 'Copied Text' : 'Copy Message'}</span>
            </button>

            <a
              id="publish-open-live-btn"
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
            >
              <ExternalLink className="w-3 h-3 text-olive" />
              <span>Open Live</span>
            </a>

            <button
              onClick={() => setShowQr(!showQr)}
              className="py-2.5 px-2 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <QrCode className="w-3 h-3 text-olive" />
              <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
