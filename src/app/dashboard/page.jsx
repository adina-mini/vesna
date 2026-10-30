'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Copy,
  Check,
  Edit,
  Trash2,
  ExternalLink,
  MessageCircle,
  PlusCircle,
  Clock,
  CheckCircle2,
  Lock,
  Layers,
  Users,
  Download,
  X,
  UserCheck,
  UserX,
  Search,
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { listUserInvitations, deleteInvitation, listRsvpsForInvitation } from '@/lib/supabase';
import { getTemplateById } from '@/templates/registry';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, openAuthModal, signInDemo } = useAuth();

  const [invitations, setInvitations] = useState([]);
  const [rsvpsMap, setRsvpsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // RSVP Management Modal State
  const [activeRsvpModalInv, setActiveRsvpModalInv] = useState(null);
  const [rsvpSearchQuery, setRsvpSearchQuery] = useState('');

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const data = await listUserInvitations(user?.id);
      setInvitations(data);

      // Fetch RSVPs for each invitation
      const rsvpData = {};
      for (const inv of data) {
        const rsvps = await listRsvpsForInvitation(inv.id);
        rsvpData[inv.id] = rsvps || [];
      }
      setRsvpsMap(rsvpData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, [user]);

  const handleCopyLink = (id) => {
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      const url = `${window.location.origin}/invite/${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this invitation? This action cannot be undone.')) {
      await deleteInvitation(id);
      loadInvitations();
    }
  };

  // Export Guest List to CSV for Excel / Sheets
  const handleExportCsv = (invitation) => {
    const rsvps = rsvpsMap[invitation.id] || [];
    if (rsvps.length === 0) {
      alert('No guest RSVPs received yet to export.');
      return;
    }

    const headers = ['Guest Name', 'Phone', 'Attendance', 'Total Guests Attending', 'Notes / Blessings', 'Date Submitted'];
    const rows = rsvps.map((r) => [
      `"${r.guest_name || ''}"`,
      `"${r.guest_phone || ''}"`,
      `"${r.attendance || ''}"`,
      `"${r.guest_count || 1}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(r.created_at).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${invitation.id}-guest-list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // 1. UNLOGGED IN / GUEST STATE (Welcoming Host Portal Gateway)
  // =========================================================================
  if (!user) {
    return (
      <div className="py-16 sm:py-24 px-4 sm:px-6 max-w-xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-paper border border-sand-300 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sand-200/40 rounded-full blur-[80px] pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-sand-100 border border-sand-300 text-olive flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive font-semibold block mb-2">
            Host Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso mb-3">
            Host Dashboard Access
          </h1>
          <p className="font-sans text-xs sm:text-sm text-espresso/70 mb-8 leading-relaxed max-w-md mx-auto">
            Sign in to access your digital invitation portfolio, manage ongoing drafts, view live guest headcount, and export your RSVP list.
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            <button
              id="dashboard-signin-btn"
              onClick={() => openAuthModal({ title: 'Sign In to Host Dashboard' })}
              className="w-full py-3.5 px-6 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-sand-300" />
              <span>Sign In to Continue</span>
            </button>

            <button
              id="dashboard-demo-host-btn"
              onClick={() => signInDemo('Wedding Host', 'host@dawatnama.studio')}
              className="w-full py-3 px-6 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-medium transition-colors cursor-pointer"
            >
              ⚡ Instant Demo Host Preview
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-espresso/60 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-olive" />
            <span>Private & secure • Your cards and guest lists remain strictly confidential.</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. LOGGED IN HOST DASHBOARD
  // =========================================================================
  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Host';

  // Overall aggregate counts across all user's invitations
  const totalInvitationsCount = invitations.length;
  const totalRsvpsCount = Object.values(rsvpsMap).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  const totalConfirmedGuestsCount = Object.values(rsvpsMap).reduce((acc, list) => {
    return acc + (list || [])
      .filter((r) => r.attendance === 'attending')
      .reduce((sum, r) => sum + (parseInt(r.guest_count, 10) || 1), 0);
  }, 0);

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 mb-8 border-b border-sand-300">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-sand-300 text-olive text-[11px] font-sans uppercase tracking-[0.2em] font-semibold mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 text-gold-500" />
            <span>Host Sanctuary Suite</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso">
            Welcome back, {userDisplayName}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-1">
            Signed in as <span className="font-medium text-espresso">{user.email}</span> &bull; Manage your digital invitation portfolio and live guest RSVPs.
          </p>
        </div>

        <Link
          href="/create"
          className="px-6 py-3 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 ring-1 ring-gold-500/30"
        >
          <PlusCircle className="w-4 h-4 text-sand-300" />
          <span>New Invitation Suite</span>
        </Link>
      </div>

      {/* Aggregate Host Metrics KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="p-6 rounded-[28px] bg-paper border border-sand-300/80 shadow-atelier flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-espresso border border-sand-200">
            <Layers className="w-6 h-6 text-olive" />
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-espresso block">
              {totalInvitationsCount}
            </span>
            <span className="font-sans text-[11px] uppercase tracking-wider text-espresso/60 font-semibold">
              Total Invitation Suites
            </span>
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-paper border border-sand-300/80 shadow-atelier flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-800 border border-emerald-200">
            <UserCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-espresso block">
              {totalConfirmedGuestsCount}
            </span>
            <span className="font-sans text-[11px] uppercase tracking-wider text-espresso/60 font-semibold">
              Confirmed Guests Attending
            </span>
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-paper border border-sand-300/80 shadow-atelier flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-espresso border border-sand-200">
            <Users className="w-6 h-6 text-olive" />
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-espresso block">
              {totalRsvpsCount}
            </span>
            <span className="font-sans text-[11px] uppercase tracking-wider text-espresso/60 font-semibold">
              Total RSVP Responses
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-espresso/60 font-sans text-xs uppercase tracking-wider">
          Loading your invitations...
        </div>
      ) : invitations.length === 0 ? (
        /* Empty State */
        <div className="p-12 sm:p-16 rounded-3xl bg-paper border border-sand-300 text-center max-w-md mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-sand-100 border border-sand-300 text-olive flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-espresso mb-2">
            No Invitations Yet
          </h3>
          <p className="font-sans text-xs sm:text-sm text-espresso/70 mb-6 leading-relaxed">
            Choose a luxury template and start personalizing your celebration card in minutes.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold uppercase tracking-wider shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-sand-300" />
            <span>Create Your First Invitation</span>
          </Link>
        </div>
      ) : (
        /* Invitations Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv) => {
            const template = getTemplateById(inv.template_id);
            const isPublished = inv.status === 'published';
            const data = inv.data || {};
            const hero = data.hero_image || template.thumbnail;
            const rsvps = rsvpsMap[inv.id] || [];

            // Headcount Calculations
            const attendingCount = rsvps
              .filter((r) => r.attendance === 'attending')
              .reduce((acc, curr) => acc + (parseInt(curr.guest_count, 10) || 1), 0);
            const declinedCount = rsvps.filter((r) => r.attendance === 'declined').length;

            return (
              <div
                key={inv.id}
                className="rounded-3xl bg-paper border border-sand-300 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail / Header */}
                  <div className="relative h-48 bg-sand-200/50 overflow-hidden">
                    <img
                      src={hero}
                      alt={inv.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent opacity-30" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-sans uppercase tracking-wider font-semibold shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 text-espresso/80 border border-sand-300 text-[10px] font-sans uppercase tracking-wider font-semibold shadow-2xs">
                          <Clock className="w-3 h-3 text-olive" />
                          Unpublished Draft
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-paper/95 text-espresso border border-sand-300 text-[10px] font-sans font-medium uppercase shadow-2xs">
                        {template.name}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-espresso mb-1 line-clamp-1">
                      {data.bride_name && data.groom_name
                        ? `${data.bride_name} & ${data.groom_name}`
                        : inv.title}
                    </h3>
                    <p className="font-sans text-xs text-espresso/70 mb-3">
                      {data.event_date_display || 'Date pending'} &bull; {data.venue_name || 'Venue pending'}
                    </p>

                    {/* Live RSVP Counter Summary */}
                    {isPublished && (
                      <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200 mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-olive" />
                          <div>
                            <span className="font-sans text-xs font-bold text-espresso block">
                              {attendingCount} Guests Confirmed
                            </span>
                            <span className="font-sans text-[10px] text-espresso/60">
                              {declinedCount > 0 ? `${declinedCount} declined` : 'Tracking live RSVPs'}
                            </span>
                          </div>
                        </div>

                        <button
                          id="view-guests-btn"
                          onClick={() => setActiveRsvpModalInv(inv)}
                          className="px-2.5 py-1 rounded-lg bg-paper hover:bg-sand-100 text-espresso text-[11px] font-sans font-semibold border border-sand-300 shadow-2xs transition-colors cursor-pointer"
                        >
                          View Guests
                        </button>
                      </div>
                    )}

                    {/* URL Link & Copy */}
                    {isPublished && (
                      <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-300 flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-[11px] text-espresso/80 truncate select-all">
                          /invite/{inv.id}
                        </span>
                        <button
                          onClick={() => handleCopyLink(inv.id)}
                          className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-espresso text-[10px] font-sans font-semibold uppercase tracking-wider border border-sand-300 transition-colors flex items-center gap-1"
                        >
                          {copiedId === inv.id ? <Check className="w-3 h-3 text-olive" /> : <Copy className="w-3 h-3 text-olive" />}
                          <span>{copiedId === inv.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 space-y-2">
                  {isPublished ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/invite/${inv.id}`}
                        target="_blank"
                        className="py-2.5 rounded-xl bg-espresso hover:bg-espresso-dark text-paper font-sans text-[11px] font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-sand-300" />
                        <span>View Live</span>
                      </Link>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`✨ You are cordially invited to celebrate with us! View our digital invitation here: ${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${inv.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-sans text-[11px] font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2 pt-2 border-t border-sand-200">
                    <Link
                      href={`/create?edit=${inv.id}`}
                      className="flex-grow py-2 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-olive" />
                      <span>Edit Card</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="p-2 rounded-xl bg-sand-50 hover:bg-burgundy/10 border border-sand-300 text-burgundy transition-colors"
                      title="Delete Invitation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GUEST RSVP MANAGEMENT MODAL                                            */}
      {/* ========================================================================= */}
      {activeRsvpModalInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-paper border border-sand-300 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-espresso max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setActiveRsvpModalInv(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-espresso/60 hover:text-espresso hover:bg-sand-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-olive font-semibold block mb-1">
                Guest Attendance & RSVP Registry
              </span>
              <h2 className="font-serif text-2xl font-bold text-espresso">
                {activeRsvpModalInv.title}
              </h2>
              <p className="font-sans text-xs text-espresso/70 mt-1">
                Real-time RSVPs submitted by guests via your invitation link.
              </p>
            </div>

            {/* Quick Summary Cards */}
            {(() => {
              const rsvps = rsvpsMap[activeRsvpModalInv.id] || [];
              const attending = rsvps.filter((r) => r.attendance === 'attending');
              const totalAttendingGuests = attending.reduce((acc, curr) => acc + (parseInt(curr.guest_count, 10) || 1), 0);
              const declined = rsvps.filter((r) => r.attendance === 'declined');

              return (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center">
                    <UserCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <span className="font-serif text-xl sm:text-2xl font-bold block">
                      {totalAttendingGuests}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-wider font-semibold">
                      Confirmed Guests
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-center">
                    <UserX className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <span className="font-serif text-xl sm:text-2xl font-bold block">
                      {declined.length}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-wider font-semibold">
                      Declined
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sand-100 border border-sand-300 text-espresso text-center">
                    <Users className="w-5 h-5 text-olive mx-auto mb-1" />
                    <span className="font-serif text-xl sm:text-2xl font-bold block">
                      {rsvps.length}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-wider font-semibold">
                      Total Responses
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Search & Export Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40" />
                <input
                  type="text"
                  placeholder="Search guest name..."
                  value={rsvpSearchQuery}
                  onChange={(e) => setRsvpSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-sand-50 border border-sand-300 text-espresso text-xs focus:outline-none focus:border-espresso"
                />
              </div>

              <button
                id="export-csv-btn"
                onClick={() => handleExportCsv(activeRsvpModalInv)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-olive" />
                <span>Export to CSV (Excel)</span>
              </button>
            </div>

            {/* Guests Table / List */}
            <div className="flex-grow overflow-y-auto border border-sand-200 rounded-2xl">
              {(() => {
                const rsvps = (rsvpsMap[activeRsvpModalInv.id] || []).filter((r) =>
                  !rsvpSearchQuery || r.guest_name.toLowerCase().includes(rsvpSearchQuery.toLowerCase())
                );

                if (rsvps.length === 0) {
                  return (
                    <div className="p-8 text-center text-espresso/60 text-xs">
                      {rsvpSearchQuery ? 'No guests matching your search.' : 'No RSVPs received for this invitation yet.'}
                    </div>
                  );
                }

                return (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sand-100 border-b border-sand-200 text-espresso/70 font-sans uppercase text-[10px] tracking-wider sticky top-0">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Guest</th>
                        <th className="py-2.5 px-4 font-semibold">Status</th>
                        <th className="py-2.5 px-4 font-semibold">Headcount</th>
                        <th className="py-2.5 px-4 font-semibold">Blessings / Notes</th>
                        <th className="py-2.5 px-4 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-200">
                      {rsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-sand-50/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-espresso">
                            {rsvp.guest_name}
                            {rsvp.guest_phone && (
                              <span className="block text-[10px] text-espresso/60">
                                {rsvp.guest_phone}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {rsvp.attendance === 'attending' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-semibold">
                                Attending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-300 text-[10px] font-semibold">
                                Declined
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-semibold text-espresso">
                            {rsvp.attendance === 'attending' ? `${rsvp.guest_count || 1} guest(s)` : '—'}
                          </td>
                          <td className="py-3 px-4 text-espresso/70 italic max-w-xs truncate">
                            {rsvp.notes ? `"${rsvp.notes}"` : '—'}
                          </td>
                          <td className="py-3 px-4 text-espresso/60 text-[11px]">
                            {new Date(rsvp.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
