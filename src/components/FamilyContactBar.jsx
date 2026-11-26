'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const DEFAULT_THEME = {
  sectionBg: '#f7f2ea',
  text: '#1C261D',
  label: '#556B52',
  cardBg: '#FFFFFF',
  cardBorder: '#E4DCCB',
  callBg: '#324530',
  callText: '#FAF7F0',
  waBg: '#324530',
  waText: '#FAF7F0',
};

export default function FamilyContactBar({ contacts = [], theme }) {
  if (!contacts || contacts.length === 0) return null;
  const t = { ...DEFAULT_THEME, ...(theme || {}) };

  const hasAny = contacts.some((c) => c?.phone);
  if (!hasAny) return null;

  return (
    <section className="py-10 px-4 sm:px-6 border-t" style={{ backgroundColor: t.sectionBg, color: t.text, borderColor: t.cardBorder }}>
      <div className="max-w-md mx-auto text-center">
        <span className="font-sans text-[11px] tracking-[0.25em] uppercase font-semibold block mb-1" style={{ color: t.label }}>
          Direct Inquiries &amp; Coordination
        </span>
        <h3 className="font-serif text-2xl font-bold mb-6" style={{ color: t.text }}>
          Family Contacts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map((c, idx) => {
            if (!c?.phone) return null;
            const rawPhone = c.phone.replace(/[^0-9+]/g, '');
            const waNumber = rawPhone.startsWith('0') ? `92${rawPhone.slice(1)}` : rawPhone.replace(/^\+/, '');

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl shadow-xs flex flex-col items-center justify-between border"
                style={{ backgroundColor: t.cardBg, borderColor: t.cardBorder }}
              >
                <div className="mb-3 text-center">
                  <p className="font-serif text-lg font-bold" style={{ color: t.text }}>
                    {c.phone}
                  </p>
                  <p className="font-sans text-xs italic mt-0.5" style={{ color: t.label }}>
                    {c.name || 'Family Contact'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full">
                  <a
                    href={`tel:${rawPhone}`}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                    style={{ backgroundColor: t.callBg, color: t.callText }}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                    style={{ backgroundColor: t.waBg, color: t.waText }}
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}