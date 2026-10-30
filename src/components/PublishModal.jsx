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
  QrCode
} from 'lucide-react';

export default function PublishModal({ isOpen, onClose, invitationId, invitationTitle }) {
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [showQr, setShowQr] = useState(false);

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

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `✨ You are cordially invited to celebrate with us!\n\nView our personalized digital invitation here:\n${inviteUrl}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  // QR Code URL using high-reliability Google Chart API
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(inviteUrl)}&color=45-35-2F&bgcolor=FAF6F0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-paper border border-sand-300 rounded-[36px] shadow-2xl p-6 sm:p-9 text-espresso text-center overflow-hidden">
        {/* Subtle decorative gold glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gold-500/15 blur-[60px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-espresso/60 hover:text-espresso hover:bg-sand-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Medallion */}
        <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-sand-100 to-sand-200 border border-sand-300 text-olive flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Sparkles className="w-8 h-8 text-gold-600 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold-500 ring-2 ring-paper" />
        </div>

        <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-olive block mb-1">
          Atelier Masterpiece Live
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso mb-2">
          Your Invitation Is Ready
        </h2>
        <p className="font-sans text-xs sm:text-sm text-espresso/75 max-w-sm mx-auto mb-6 leading-relaxed">
          Your bespoke invitation is live on the web and ready to enchant family and guests.
        </p>

        {/* Shareable Link Box */}
        <div className="p-3.5 rounded-2xl bg-sand-50/90 border border-sand-300 flex items-center justify-between gap-2 mb-5">
          <span className="font-mono text-xs text-espresso/90 truncate select-all text-left">
            {inviteUrl}
          </span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-xl bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-gold-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>

        {/* QR Code Collapsible View */}
        {showQr && (
          <div className="mb-5 p-4 rounded-2xl bg-sand-50 border border-sand-300 animate-in fade-in zoom-in-95 duration-150">
            <p className="text-[11px] font-sans text-espresso/70 mb-3">
              Scan with smartphone camera or print on physical wedding card inserts:
            </p>
            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-xs border border-sand-200 flex items-center justify-center">
              <img src={qrApiUrl} alt="Invitation QR Code" className="w-full h-full object-contain" />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Share on WhatsApp */}
          <a
            id="publish-whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Share on WhatsApp With Family</span>
          </a>

          {/* Secondary Actions Row: Open Live & Toggle QR */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              id="publish-open-live-btn"
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-2xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-olive" />
              <span>Open Live</span>
            </a>

            <button
              onClick={() => setShowQr(!showQr)}
              className="py-3 px-3 rounded-2xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-olive" />
              <span>{showQr ? 'Hide QR' : 'Show QR Code'}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-sand-200">
          <p className="text-[11px] font-sans text-espresso/60">
            Track real-time guest RSVP headcounts anytime from your <strong>Host Dashboard</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
