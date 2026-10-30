'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getPlatformSettings, submitPaymentProof } from '@/lib/supabase';
import VesnaLogo from '@/components/VesnaLogo';

export default function PaymentModal({
  isOpen,
  onClose,
  invitationId,
  coupleTitle = 'Your Celebration',
  suiteName = 'Atelier Suite',
  onPaymentSuccess,
}) {
  const [settings, setSettings] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('easypaisa'); // 'easypaisa' | 'jazzcash' | 'bank'
  const [copiedField, setCopiedField] = useState(null);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Post-submission confirmation state
  const [orderSubmitted, setOrderSubmitted] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const s = getPlatformSettings();
      setSettings(s);
      setOrderSubmitted(null);
      setErrorMsg('');
      setTrxId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pricePkr = settings?.suitePricePkr || '2,500';
  const conciergeWhatsApp = settings?.conciergeWhatsApp?.replace(/[^0-9]/g, '') || '923008472911';

  const handleCopy = (text, fieldKey) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleSubmitProof = async (e) => {
    e?.preventDefault();
    if (!trxId.trim() && !senderPhone.trim()) {
      setErrorMsg('Please provide your Transaction ID (TID) or sender mobile number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const order = await submitPaymentProof({
        invitationId,
        coupleName: coupleTitle,
        suiteName,
        amount: `PKR ${pricePkr}`,
        method: selectedMethod,
        trxId: trxId.trim(),
        senderName: senderName.trim(),
        senderPhone: senderPhone.trim(),
        notes: notes.trim(),
      });

      setOrderSubmitted(order);
      if (onPaymentSuccess) {
        onPaymentSuccess(order);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit payment proof. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappVerificationUrl = `https://wa.me/${conciergeWhatsApp}?text=${encodeURIComponent(
    `Assalamu Alaikum VESNA Concierge!\n\nI have transferred PKR ${pricePkr} via ${selectedMethod.toUpperCase()} for my invitation:\n• Invitation ID: ${invitationId}\n• Couple: ${coupleTitle}\n• Trx ID / TID: ${trxId || 'Attached below'}\n\nKindly verify and activate our invitation suite.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-paper border border-sand-300 rounded-[36px] shadow-2xl p-6 sm:p-9 text-espresso overflow-hidden my-8">
        {/* Subtle decorative gold ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-48 bg-gold-500/10 rounded-full blur-[70px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-espresso/60 hover:text-espresso hover:bg-sand-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =================================================================== */}
        {/* 1. SUCCESS CONFIRMATION STATE (After submitting proof)               */}
        {/* =================================================================== */}
        {orderSubmitted ? (
          <div className="text-center py-4 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-olive/10 border border-olive/30 text-olive flex items-center justify-center mx-auto shadow-xs">
              <Clock className="w-8 h-8 text-olive animate-pulse" />
            </div>

            <div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-olive block mb-1">
                Order Received • Mode A
              </span>
              <h2 className="font-serif text-3xl font-normal text-espresso">
                Verification in Progress
              </h2>
              <p className="font-sans text-xs text-espresso/70 max-w-sm mx-auto mt-2 leading-relaxed">
                Thank you! Your payment proof for <strong className="text-espresso">{coupleTitle}</strong> has been logged. Our concierge team is verifying your transfer.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-sand-100/80 border border-sand-300 text-left text-xs font-sans space-y-2">
              <div className="flex justify-between border-b border-sand-200/80 pb-2">
                <span className="text-espresso/60">Invitation ID:</span>
                <span className="font-mono font-bold text-espresso">{invitationId}</span>
              </div>
              <div className="flex justify-between border-b border-sand-200/80 pb-2">
                <span className="text-espresso/60">Amount Payable:</span>
                <span className="font-bold text-olive">PKR {pricePkr}</span>
              </div>
              <div className="flex justify-between border-b border-sand-200/80 pb-2">
                <span className="text-espresso/60">Payment Method:</span>
                <span className="capitalize font-semibold text-espresso">{orderSubmitted.method}</span>
              </div>
              {orderSubmitted.trx_id && (
                <div className="flex justify-between">
                  <span className="text-espresso/60">Transaction ID:</span>
                  <span className="font-mono font-bold text-espresso">{orderSubmitted.trx_id}</span>
                </div>
              )}
            </div>

            {/* WhatsApp Fast-Track Verification */}
            <div className="pt-2 space-y-3">
              <a
                href={whatsappVerificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Fast-Track on WhatsApp (Send Screenshot)</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 text-espresso font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Back to Design Studio
              </button>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* 2. PAYMENT CHECKOUT STEPS                                           */
          /* =================================================================== */
          <div className="space-y-6">
            {/* Header Medallion */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-[10px] font-sans font-bold uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                <span>Atelier Activation • Mode A</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-espresso mb-1">
                Unlock Your Celebration Suite
              </h2>
              <p className="font-sans text-xs text-espresso/70">
                Direct mobile wallet transfer for <strong className="text-espresso font-medium">{coupleTitle}</strong>.
              </p>

              {/* Price Banner */}
              <div className="mt-4 p-3.5 rounded-2xl bg-sand-100/90 border border-sand-300 flex items-center justify-between">
                <span className="text-xs font-sans text-espresso/70">
                  One-Time Suite Fee (Unlimited Guests):
                </span>
                <span className="font-serif text-xl font-bold text-olive">
                  PKR {pricePkr}
                </span>
              </div>
            </div>

            {/* Method Tabs */}
            <div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-espresso/70 block mb-2">
                1. Select Payment Method
              </span>

              <div className="grid grid-cols-3 gap-2">
                {/* Easypaisa */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('easypaisa')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'easypaisa'
                      ? 'border-green-600 bg-green-50/80 shadow-xs ring-2 ring-green-600/20'
                      : 'border-sand-300 hover:bg-sand-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block mb-1" />
                  <span className="font-sans text-xs font-bold text-espresso block">
                    Easypaisa
                  </span>
                  <span className="text-[9px] font-sans text-espresso/60 block">Mobile Wallet</span>
                </button>

                {/* JazzCash */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('jazzcash')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'jazzcash'
                      ? 'border-red-600 bg-red-50/80 shadow-xs ring-2 ring-red-600/20'
                      : 'border-sand-300 hover:bg-sand-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block mb-1" />
                  <span className="font-sans text-xs font-bold text-espresso block">
                    JazzCash
                  </span>
                  <span className="text-[9px] font-sans text-espresso/60 block">Mobile Wallet</span>
                </button>

                {/* Bank / SadaPay */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'bank'
                      ? 'border-olive bg-sand-100 shadow-xs ring-2 ring-olive/20'
                      : 'border-sand-300 hover:bg-sand-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-olive inline-block mb-1" />
                  <span className="font-sans text-xs font-bold text-espresso block">
                    Bank / Raast
                  </span>
                  <span className="text-[9px] font-sans text-espresso/60 block">IBAN Transfer</span>
                </button>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="p-4 rounded-2xl bg-sand-50 border border-sand-300/90 text-xs font-sans space-y-3">
              {selectedMethod === 'easypaisa' && (
                <>
                  <div className="flex items-center justify-between border-b border-sand-200 pb-2">
                    <span className="text-espresso/60">Easypaisa Account Title:</span>
                    <span className="font-bold text-espresso">{settings?.easypaisa?.accountTitle || 'VESNA Atelier'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-espresso/60 block text-[10px]">Mobile Account Number:</span>
                      <span className="font-mono text-sm font-bold text-espresso">
                        {settings?.easypaisa?.accountNumber || '0300 8472911'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings?.easypaisa?.accountNumber || '03008472911', 'ep')}
                      className="px-3 py-1.5 rounded-xl bg-paper hover:bg-sand-100 border border-sand-300 text-espresso text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      {copiedField === 'ep' ? <Check className="w-3.5 h-3.5 text-olive" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'ep' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </>
              )}

              {selectedMethod === 'jazzcash' && (
                <>
                  <div className="flex items-center justify-between border-b border-sand-200 pb-2">
                    <span className="text-espresso/60">JazzCash Account Title:</span>
                    <span className="font-bold text-espresso">{settings?.jazzcash?.accountTitle || 'VESNA Atelier'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-espresso/60 block text-[10px]">Mobile Account Number:</span>
                      <span className="font-mono text-sm font-bold text-espresso">
                        {settings?.jazzcash?.accountNumber || '0300 8472911'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings?.jazzcash?.accountNumber || '03008472911', 'jc')}
                      className="px-3 py-1.5 rounded-xl bg-paper hover:bg-sand-100 border border-sand-300 text-espresso text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      {copiedField === 'jc' ? <Check className="w-3.5 h-3.5 text-olive" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'jc' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </>
              )}

              {selectedMethod === 'bank' && (
                <>
                  <div className="flex items-center justify-between border-b border-sand-200 pb-2">
                    <span className="text-espresso/60">Bank Name &amp; Title:</span>
                    <span className="font-bold text-espresso text-right">
                      {settings?.bankTransfer?.bankName || 'Meezan Bank'} • {settings?.bankTransfer?.accountTitle || 'VESNA Studio'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-espresso/60 block text-[10px]">IBAN / Account Number:</span>
                      <span className="font-mono text-[11px] font-bold text-espresso">
                        {settings?.bankTransfer?.iban || 'PK82MEZN0001234567890123'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings?.bankTransfer?.iban || 'PK82MEZN0001234567890123', 'iban')}
                      className="px-3 py-1.5 rounded-xl bg-paper hover:bg-sand-100 border border-sand-300 text-espresso text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-olive" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'iban' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 2: Proof Submission Form */}
            <form onSubmit={handleSubmitProof} className="space-y-3 pt-1">
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-espresso/70 block">
                2. Enter Transfer Proof
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-espresso/80 mb-1">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharjeel Khan"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-sand-50 border border-sand-300 text-xs text-espresso focus:outline-hidden focus:border-olive"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-espresso/80 mb-1">
                    Sender Mobile / Phone
                  </label>
                  <input
                    type="text"
                    placeholder="0300 1234567"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-sand-50 border border-sand-300 text-xs text-espresso focus:outline-hidden focus:border-olive font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-espresso/80 mb-1">
                  Transaction ID (TID) from SMS / App Receipt
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1948201849"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-sand-50 border border-sand-300 text-xs text-espresso focus:outline-hidden focus:border-olive font-mono"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-bold uppercase tracking-[0.2em] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <span>Submitting Verification...</span>
                ) : (
                  <>
                    <span>Submit Proof for Activation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                  </>
                )}
              </button>

              {/* Or Fast Track via WhatsApp */}
              <div className="pt-2 text-center">
                <a
                  href={whatsappVerificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans text-green-700 hover:text-green-800 font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Prefer to send receipt screenshot via WhatsApp? Click here</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
