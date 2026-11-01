'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import VesnaLogo from '@/components/VesnaLogo';
import { TEMPLATES, getAllTemplates } from '@/templates/registry';
import AddTemplateModal from '@/components/AddTemplateModal';
import { fetchCustomTemplates, removeCustomTemplate } from '@/lib/customTemplates';
import {
  listAllInvitationsForAdmin,
  updateInvitationStatus,
  deleteInvitation,
  listAllRsvpsForAdmin,
  getPlatformSettings,
  savePlatformSettings,
  listAllOrdersForAdmin,
  verifyAndActivateOrder,
  rejectOrder,
} from '@/lib/supabase';
import {
  Shield,
  ShieldCheck,
  CreditCard,
  Clock,
  Lock,
  KeyRound,
  Sparkles,
  Layers,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  MessageSquare,
  Download,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Users,
  Check,
  Calendar,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Save,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

const ADMIN_PASSCODE = 'vesna2026';
const ADMIN_SESSION_KEY = 'vesna_super_admin_unlocked';

export default function AdminPage() {
  // Authentication Gate State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'suites' | 'settings'

  // Data State
  const [invitations, setInvitations] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'draft' | 'pending_payment'

  // Suite Catalog Customization State (Stored locally)
  const [suiteOverrides, setSuiteOverrides] = useState({});
  const [allCatalogSuites, setAllCatalogSuites] = useState(() => getAllTemplates());
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);

  // Platform Settings State
  const [settings, setSettings] = useState({
    conciergeWhatsApp: '+92 300 8472911',
    conciergeEmail: 'concierge@vesna.atelier',
    bannerActive: true,
    bannerMessage: 'Winter Wedding Season: Enjoy Complimentary 3D Gold Foil Shimmer on All 15 Suites',
    bannerLink: '/templates',
    suitePricePkr: '2500',
    currency: 'PKR',
    paymentMode: 'strict',
    easypaisa: {
      accountTitle: 'VESNA Atelier',
      accountNumber: '0300 8472911',
    },
    jazzcash: {
      accountTitle: 'VESNA Atelier',
      accountNumber: '0300 8472911',
    },
    bankTransfer: {
      bankName: 'Meezan Bank',
      accountTitle: 'VESNA Luxury Studio',
      iban: 'PK82MEZN0001234567890123',
      accountNumber: '01020304050607',
    },
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Invitation To Delete (Modal)
  const [inviteToDelete, setInviteToDelete] = useState(null);

  // Check persistent admin session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
      if (unlocked) {
        setIsUnlocked(true);
      }
    }
  }, []);

  // Load Data
  const loadPlatformData = async () => {
    setLoading(true);
    try {
      const [invs, rsvpList, orderList] = await Promise.all([
        listAllInvitationsForAdmin(),
        listAllRsvpsForAdmin(),
        listAllOrdersForAdmin(),
      ]);
      setInvitations(invs || []);
      setRsvps(rsvpList || []);
      setOrders(orderList || []);

      const savedSettings = getPlatformSettings();
      setSettings(savedSettings);

      await fetchCustomTemplates();
      setAllCatalogSuites(getAllTemplates());

      const savedSuites = localStorage.getItem('vesna_suite_overrides');
      if (savedSuites) {
        try {
          setSuiteOverrides(JSON.parse(savedSuites));
        } catch (e) {}
      }
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOrder = async (order) => {
    await verifyAndActivateOrder(order.id, order.invitation_id);
    showNotice(`✅ Order verified! ${order.couple_name}'s invitation is now LIVE.`);
    await loadPlatformData();
  };

  const handleRejectOrder = async (order) => {
    await rejectOrder(order.id, order.invitation_id);
    showNotice(`Order for ${order.couple_name} rejected.`);
    await loadPlatformData();
  };

  useEffect(() => {
    if (isUnlocked) {
      loadPlatformData();
    }
  }, [isUnlocked]);

  // Handle Passcode Unlock
  const handleUnlock = (e) => {
    e?.preventDefault();
    if (passcodeInput.trim() === ADMIN_PASSCODE || passcodeInput.trim().toLowerCase() === 'admin') {
      setIsUnlocked(true);
      setAuthError('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      }
    } else {
      setAuthError('Invalid Admin Passcode. Use "vesna2026" or 1-tap demo access.');
    }
  };

  const handleInstantDemoUnlock = () => {
    setIsUnlocked(true);
    setAuthError('');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    }
  };

  const handleLockConsole = () => {
    setIsUnlocked(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  };

  // Toggle Invitation Status
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    await updateInvitationStatus(id, nextStatus);
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: nextStatus } : inv))
    );
    showNotice(`Invitation ${id} status updated to ${nextStatus.toUpperCase()}`);
  };

  // Confirm Delete Invitation
  const confirmDelete = async () => {
    if (!inviteToDelete) return;
    await deleteInvitation(inviteToDelete.id);
    setInvitations((prev) => prev.filter((i) => i.id !== inviteToDelete.id));
    showNotice(`Invitation ${inviteToDelete.id} permanently removed.`);
    setInviteToDelete(null);
  };

  // Toggle Suite Active / Inactive
  const toggleSuiteActive = (suiteId) => {
    setSuiteOverrides((prev) => {
      const current = prev[suiteId] || {};
      const updated = {
        ...prev,
        [suiteId]: {
          ...current,
          inactive: !current.inactive,
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('vesna_suite_overrides', JSON.stringify(updated));
      }
      return updated;
    });
    showNotice(`Suite status updated.`);
  };

  // Toggle Suite Featured
  const toggleSuiteFeatured = (suiteId) => {
    setSuiteOverrides((prev) => {
      const current = prev[suiteId] || {};
      const updated = {
        ...prev,
        [suiteId]: {
          ...current,
          featured: !current.featured,
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('vesna_suite_overrides', JSON.stringify(updated));
      }
      return updated;
    });
    showNotice(`Suite badge updated.`);
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    savePlatformSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    showNotice('Platform settings successfully saved.');
  };

  const showNotice = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  // Filtered Invitations
  const filteredInvitations = useMemo(() => {
    return invitations.filter((inv) => {
      const data = inv.data || {};
      const title = `${data.bride_name || ''} ${data.groom_name || ''} ${inv.title || ''}`.toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase()) || inv.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invitations, searchQuery, statusFilter]);

  // Compute Platform Metrics
  const metrics = useMemo(() => {
    const total = invitations.length;
    const published = invitations.filter((i) => i.status === 'published').length;
    const pendingPayment = invitations.filter((i) => i.status === 'pending_payment').length;
    const drafts = total - published - pendingPayment;
    const totalRsvps = rsvps.length;
    const totalGuestsAttending = rsvps
      .filter((r) => r.attendance === 'attending')
      .reduce((sum, r) => sum + (parseInt(r.guest_count, 10) || 1), 0);
    const suitesCount = allCatalogSuites.length || TEMPLATES.length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const verifiedOrders = orders.filter((o) => o.status === 'verified').length;
    const totalRevenue = verifiedOrders * (parseInt(settings?.suitePricePkr || '2500', 10) || 2500);

    return {
      total,
      published,
      pendingPayment,
      drafts,
      totalRsvps,
      totalGuestsAttending,
      suitesCount,
      pendingOrders,
      verifiedOrders,
      totalRevenue,
      conversionRate: total > 0 ? Math.round((published / total) * 100) : 0,
    };
  }, [invitations, rsvps, orders, settings, allCatalogSuites]);

  // Delete Custom Bespoke Suite
  const handleDeleteCustomSuite = async (suiteId, suiteName) => {
    if (window.confirm(`Are you sure you want to permanently delete custom suite "${suiteName}" from the atelier catalog?`)) {
      await removeCustomTemplate(suiteId);
      setAllCatalogSuites(getAllTemplates());
      showNotice(`Custom suite "${suiteName}" removed from catalog.`);
    }
  };

  // Export CSV Data
  const exportCsv = () => {
    const rows = [
      ['ID', 'Title', 'Template', 'Status', 'Event Date', 'Venue', 'Created At'],
      ...invitations.map((i) => [
        i.id,
        i.title || `${i.data?.bride_name} & ${i.data?.groom_name}`,
        i.template_id,
        i.status,
        i.data?.event_date_display || '',
        i.data?.venue_name || '',
        i.updated_at || '',
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map(x => `"${(x || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vesna_master_invitations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // 1. SECURITY GATE (If not unlocked)
  // =========================================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#14110F] text-paper flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Gold Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-burgundy/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#1C1815] border border-sand-300/30 rounded-[36px] p-8 sm:p-10 shadow-2xl relative text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sand-100/10 to-sand-200/5 border border-gold-500/30 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Lock className="w-7 h-7 text-gold-500" />
          </div>

          <VesnaLogo size="md" className="justify-center mb-3" />
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-gold-500 font-semibold block mb-2">
            Super Admin Console
          </span>
          <h1 className="font-serif text-2xl text-paper font-normal tracking-tight mb-2">
            Platform Master Access
          </h1>
          <p className="font-sans text-xs text-sand-300/70 mb-6 leading-relaxed">
            Restricted administrative gateway for global suite controls, customer concierge, and platform oversight.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-burgundy/20 border border-burgundy/40 text-rose-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-sand-300/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Enter Admin Passcode"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#26211C] border border-sand-300/30 text-paper text-sm placeholder:text-sand-300/40 focus:outline-hidden focus:border-gold-500 transition-colors text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-400 hover:to-gold-600 text-espresso font-sans text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-200 cursor-pointer"
            >
              Unlock Console
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-sand-300/15">
            <button
              type="button"
              onClick={handleInstantDemoUnlock}
              className="text-[11px] font-sans text-gold-400/90 hover:text-gold-300 underline underline-offset-4 cursor-pointer transition-colors"
            >
              ⚡ Instant 1-Tap Admin Access (Demo Mode)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MAIN SUPER ADMIN DASHBOARD CONSOLE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-espresso font-sans">
      {/* Top Admin Notice Bar */}
      {actionSuccess && (
        <div className="sticky top-0 z-50 bg-olive text-paper py-2 px-4 text-center text-xs font-sans font-medium flex items-center justify-center gap-2 animate-fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 text-gold-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-paper border-b border-sand-300/80 sticky top-0 z-40 backdrop-blur-md bg-paper/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group">
              <VesnaLogo size="md" />
            </Link>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-[10px] font-sans font-bold uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5 text-gold-600" />
              <span>Super Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300/80 text-espresso text-xs font-sans font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3 text-espresso/60" />
            </Link>

            <button
              onClick={handleLockConsole}
              className="px-3.5 py-1.5 rounded-full bg-sand-200 hover:bg-burgundy/10 hover:text-burgundy text-espresso/80 text-xs font-sans font-medium transition-colors cursor-pointer"
            >
              Lock Console
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Title & Headline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive font-semibold block mb-1">
              Atelier Management Engine
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso tracking-tight">
              Platform Master Console
            </h1>
            <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-1">
              Oversee client celebration suites, platform conversion metrics, catalog availability, and concierge contacts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadPlatformData}
              className="px-4 py-2.5 rounded-full bg-paper border border-sand-300 text-espresso text-xs font-sans font-semibold flex items-center gap-2 hover:bg-sand-100 transition-colors cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-olive ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Live Data</span>
            </button>

            <button
              onClick={exportCsv}
              className="px-4 py-2.5 rounded-full bg-espresso text-paper text-xs font-sans font-semibold flex items-center gap-2 hover:bg-espresso-dark transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-gold-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* KPI METRIC CARDS (4-Column)                                         */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Total Invitations */}
          <div className="p-6 rounded-3xl bg-paper border border-sand-300/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-espresso/70">
                Total Invitations
              </span>
              <div className="w-8 h-8 rounded-xl bg-sand-100 border border-sand-200 flex items-center justify-center text-olive">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-espresso block leading-tight">
                {metrics.total}
              </span>
              <div className="flex items-center gap-3 text-xs font-sans text-espresso/70 mt-2">
                <span className="text-olive font-semibold">{metrics.published} Live</span>
                <span>•</span>
                <span className="text-espresso/50">{metrics.drafts} Drafts</span>
              </div>
            </div>
          </div>

          {/* 2. Platform RSVPs */}
          <div className="p-6 rounded-3xl bg-paper border border-sand-300/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-espresso/70">
                Total Guest RSVPs
              </span>
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-espresso block leading-tight">
                {metrics.totalRsvps}
              </span>
              <span className="text-xs font-sans text-olive font-semibold block mt-2">
                {metrics.totalGuestsAttending} Confirmed Attending
              </span>
            </div>
          </div>

          {/* 3. Catalog Suites Available */}
          <div className="p-6 rounded-3xl bg-paper border border-sand-300/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-espresso/70">
                Handcrafted Suites
              </span>
              <div className="w-8 h-8 rounded-xl bg-burgundy/10 border border-burgundy/20 flex items-center justify-center text-burgundy">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-espresso block leading-tight">
                {metrics.suitesCount}
              </span>
              <span className="text-xs font-sans text-espresso/60 block mt-2">
                Active in Directory
              </span>
            </div>
          </div>

          {/* 4. Publish Conversion Rate */}
          <div className="p-6 rounded-3xl bg-paper border border-sand-300/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-espresso/70">
                Conversion Rate
              </span>
              <div className="w-8 h-8 rounded-xl bg-sand-100 border border-sand-200 flex items-center justify-center text-olive">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-espresso block leading-tight">
                {metrics.conversionRate}%
              </span>
              <span className="text-xs font-sans text-olive font-semibold block mt-2">
                Draft to Published
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* NAVIGATION TABS                                                     */}
        {/* =================================================================== */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-sand-100 border border-sand-300/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-espresso text-paper shadow-xs'
                : 'text-espresso/70 hover:text-espresso hover:bg-paper/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Master Invitations ({invitations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-espresso text-paper shadow-xs'
                : 'text-espresso/70 hover:text-espresso hover:bg-paper/60'
            }`}
          >
            <CreditCard className="w-4 h-4 text-gold-400" />
            <span>Orders &amp; Payments ({orders.length})</span>
            {metrics.pendingOrders > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-gold-500 text-espresso text-[10px] font-bold animate-pulse">
                {metrics.pendingOrders} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('suites')}
            className={`px-5 py-2.5 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'suites'
                ? 'bg-espresso text-paper shadow-xs'
                : 'text-espresso/70 hover:text-espresso hover:bg-paper/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Suite Catalog Controls ({allCatalogSuites.length || TEMPLATES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-espresso text-paper shadow-xs'
                : 'text-espresso/70 hover:text-espresso hover:bg-paper/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Platform &amp; Concierge Settings</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: MASTER INVITATIONS MANAGER                                   */}
        {/* =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-paper border border-sand-300 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-espresso/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by couple, venue or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-sand-50 border border-sand-300 text-xs text-espresso placeholder:text-espresso/50 focus:outline-hidden focus:border-olive"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-sans text-espresso/60 hidden md:inline">Status:</span>
                <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl border border-sand-200">
                  {['all', 'published', 'draft'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        statusFilter === s
                          ? 'bg-paper text-espresso shadow-xs'
                          : 'text-espresso/60 hover:text-espresso'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <Link
                  href="/create"
                  className="px-4 py-2 rounded-xl bg-espresso hover:bg-espresso-dark text-paper text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-2xs ml-auto"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-gold-400" />
                  <span>New Card</span>
                </Link>
              </div>
            </div>

            {/* Invitations Table */}
            <div className="rounded-3xl bg-paper border border-sand-300/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sand-100/80 border-b border-sand-300/80 text-[11px] font-sans uppercase tracking-widest text-espresso/70">
                      <th className="py-4 px-6 font-bold">Celebration / Couple</th>
                      <th className="py-4 px-6 font-bold">Suite Template</th>
                      <th className="py-4 px-6 font-bold">Status</th>
                      <th className="py-4 px-6 font-bold">Event Date &amp; Venue</th>
                      <th className="py-4 px-6 font-bold text-right">Concierge Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200/70 text-xs font-sans">
                    {filteredInvitations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-espresso/60">
                          No celebration invitations match your query.
                        </td>
                      </tr>
                    ) : (
                      filteredInvitations.map((inv) => {
                        const data = inv.data || {};
                        const coupleTitle = data.bride_name && data.groom_name
                          ? `${data.bride_name} & ${data.groom_name}`
                          : inv.title || 'Untitled Celebration';
                        const isPublished = inv.status === 'published';

                        return (
                          <tr key={inv.id} className="hover:bg-sand-50/80 transition-colors">
                            {/* Couple & ID */}
                            <td className="py-4 px-6">
                              <span className="font-serif font-bold text-sm text-espresso block">
                                {coupleTitle}
                              </span>
                              <span className="font-mono text-[10px] text-espresso/50 block mt-0.5">
                                ID: {inv.id}
                              </span>
                            </td>

                            {/* Template */}
                            <td className="py-4 px-6">
                              <span className="font-sans font-semibold text-espresso block capitalize">
                                {inv.template_id?.replace(/-/g, ' ')}
                              </span>
                              <span className="text-[10px] text-olive font-medium uppercase tracking-wider block">
                                {inv.event_type}
                              </span>
                            </td>

                            {/* Status Pill with Toggle */}
                            <td className="py-4 px-6">
                              <button
                                onClick={() => handleToggleStatus(inv.id, inv.status)}
                                title="Click to toggle status"
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider cursor-pointer border transition-all ${
                                  isPublished
                                    ? 'bg-olive/10 text-olive border-olive/30 hover:bg-olive/20'
                                    : 'bg-sand-200 text-espresso/70 border-sand-300 hover:bg-sand-300'
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isPublished ? 'bg-olive' : 'bg-espresso/40'
                                  }`}
                                />
                                <span>{inv.status}</span>
                              </button>
                            </td>

                            {/* Date & Venue */}
                            <td className="py-4 px-6 text-espresso/80">
                              <span className="block font-medium">
                                {data.event_date_display || 'Date pending'}
                              </span>
                              <span className="text-[11px] text-espresso/60 block truncate max-w-xs">
                                {data.venue_name || 'Venue pending'}
                              </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/invite/${inv.id}`}
                                  target="_blank"
                                  className="p-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-espresso transition-colors"
                                  title="Open Public Link"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>

                                <Link
                                  href={`/create?edit=${inv.id}`}
                                  className="p-2 rounded-xl bg-sand-100 hover:bg-olive hover:text-paper text-espresso transition-colors"
                                  title="Edit in Studio"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </Link>

                                <button
                                  onClick={() => setInviteToDelete(inv)}
                                  className="p-2 rounded-xl bg-sand-100 hover:bg-burgundy/10 hover:text-burgundy text-espresso/60 transition-colors cursor-pointer"
                                  title="Delete Card"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: ORDERS & PAYMENTS (Mode A Activation)                        */}
        {/* =================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-sand-100/90 border border-sand-300 text-xs text-espresso/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>
                <strong>Mode A Concierge Queue:</strong> Review client Easypaisa, JazzCash, or bank transfers. Clicking <strong>Verify &amp; Activate</strong> immediately switches the client invitation to <strong>LIVE</strong>.
              </span>
              <span className="font-bold text-olive whitespace-nowrap">
                Est. Total Revenue: PKR {metrics.totalRevenue?.toLocaleString()}
              </span>
            </div>

            <div className="rounded-3xl bg-paper border border-sand-300/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sand-100/80 border-b border-sand-300/80 text-[11px] font-sans uppercase tracking-widest text-espresso/70">
                      <th className="py-4 px-6 font-bold">Couple &amp; Order ID</th>
                      <th className="py-4 px-6 font-bold">Suite &amp; Amount</th>
                      <th className="py-4 px-6 font-bold">Method &amp; Trx ID</th>
                      <th className="py-4 px-6 font-bold">Sender Details</th>
                      <th className="py-4 px-6 font-bold">Status</th>
                      <th className="py-4 px-6 font-bold text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200/70 text-xs font-sans">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-espresso/60">
                          No orders in the payment queue.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => {
                        const isPending = order.status === 'pending';
                        const isVerified = order.status === 'verified';

                        return (
                          <tr key={order.id} className="hover:bg-sand-50/80 transition-colors">
                            {/* Couple & Order ID */}
                            <td className="py-4 px-6">
                              <span className="font-serif font-bold text-sm text-espresso block">
                                {order.couple_name}
                              </span>
                              <span className="font-mono text-[10px] text-espresso/50 block mt-0.5">
                                Order: {order.id} • Inv: {order.invitation_id}
                              </span>
                            </td>

                            {/* Suite & Amount */}
                            <td className="py-4 px-6">
                              <span className="font-semibold text-espresso block">
                                {order.suite_name}
                              </span>
                              <span className="font-bold text-olive block mt-0.5">
                                {order.amount}
                              </span>
                            </td>

                            {/* Method & Trx ID */}
                            <td className="py-4 px-6">
                              <span className="uppercase text-[11px] font-bold tracking-wider text-espresso block">
                                {order.method}
                              </span>
                              <span className="font-mono text-[10px] text-gold-700 bg-sand-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                                TID: {order.trx_id || 'Sent on WhatsApp'}
                              </span>
                            </td>

                            {/* Sender Details */}
                            <td className="py-4 px-6 text-espresso/80">
                              <span className="block font-medium">
                                {order.sender_name || 'Name not provided'}
                              </span>
                              <span className="text-[11px] font-mono text-espresso/60 block">
                                {order.sender_phone || 'Phone not provided'}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider ${
                                  isVerified
                                    ? 'bg-olive/10 text-olive border border-olive/30'
                                    : isPending
                                    ? 'bg-gold-500/10 text-gold-700 border border-gold-500/30 animate-pulse'
                                    : 'bg-sand-200 text-espresso/60'
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isVerified ? 'bg-olive' : isPending ? 'bg-gold-500' : 'bg-espresso/40'
                                  }`}
                                />
                                <span>{order.status}</span>
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/invite/${order.invitation_id}`}
                                  target="_blank"
                                  className="p-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-espresso transition-colors"
                                  title="Preview Public Invitation"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>

                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => handleVerifyOrder(order)}
                                      className="px-3.5 py-1.5 rounded-xl bg-olive hover:bg-olive-dark text-paper font-sans text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                                      title="Verify payment and publish suite"
                                    >
                                      <Check className="w-3.5 h-3.5 text-gold-400" />
                                      <span>Verify &amp; Activate</span>
                                    </button>

                                    <button
                                      onClick={() => handleRejectOrder(order)}
                                      className="p-1.5 rounded-xl bg-sand-100 hover:bg-burgundy/10 hover:text-burgundy text-espresso/60 transition-colors cursor-pointer"
                                      title="Reject order"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SUITE CATALOG CONTROLS                                       */}
        {/* =================================================================== */}
        {activeTab === 'suites' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-sand-100/90 border border-sand-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base font-bold text-espresso">Atelier Suite Catalog</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-sand-200 text-espresso text-[11px] font-sans font-bold">
                    {allCatalogSuites.length} Suites Total
                  </span>
                </div>
                <p className="font-sans text-xs text-espresso/70">
                  Manage platform catalog, feature designs, or craft new bespoke celebration suites dynamically.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddTemplateOpen(true)}
                className="px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-espresso font-sans text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>+ Craft Bespoke Suite</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCatalogSuites.map((suite) => {
                const suiteId = suite.id;
                const override = suiteOverrides[suiteId] || {};
                const isInactive = Boolean(override.inactive);
                const isFeatured = Boolean(override.featured || suite.featured);
                const isCustom = Boolean(suite.isCustom);

                return (
                  <div
                    key={suiteId}
                    className={`p-6 rounded-3xl bg-paper border transition-all duration-300 flex flex-col justify-between ${
                      isInactive
                        ? 'border-sand-300/40 opacity-60'
                        : 'border-sand-300/90 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-sand-100 border border-sand-200 text-[10px] font-sans font-bold uppercase tracking-wider text-olive">
                            {suite.category}
                          </span>

                          {isCustom && (
                            <span className="px-2 py-0.5 rounded-full bg-olive/10 border border-olive/30 text-olive text-[10px] font-sans font-bold uppercase tracking-wider">
                              Custom Bespoke
                            </span>
                          )}
                        </div>

                        {isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-gold-600" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-bold text-espresso mb-1">
                        {suite.name}
                      </h3>
                      <p className="font-sans text-xs text-espresso/70 mb-4 line-clamp-2">
                        {suite.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-sand-200/80 flex items-center justify-between">
                      {/* Active Toggle */}
                      <button
                        onClick={() => toggleSuiteActive(suiteId)}
                        className={`text-xs font-sans font-semibold flex items-center gap-1.5 cursor-pointer ${
                          isInactive ? 'text-espresso/40' : 'text-olive'
                        }`}
                      >
                        {isInactive ? (
                          <>
                            <ToggleLeft className="w-5 h-5 text-sand-400" />
                            <span>Inactive</span>
                          </>
                        ) : (
                          <>
                            <ToggleRight className="w-5 h-5 text-olive" />
                            <span>Active</span>
                          </>
                        )}
                      </button>

                      {/* Featured Toggle */}
                      <button
                        onClick={() => toggleSuiteFeatured(suiteId)}
                        className={`px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer border ${
                          isFeatured
                            ? 'bg-gold-500 text-espresso border-gold-600 font-bold'
                            : 'bg-sand-100 text-espresso/60 border-sand-300 hover:text-espresso'
                        }`}
                      >
                        {isFeatured ? '★ Featured' : 'Feature'}
                      </button>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/create?template=${suiteId}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-espresso/70 hover:text-espresso transition-colors"
                          title="Preview Suite in Studio"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomSuite(suiteId, suite.name)}
                            className="p-1.5 rounded-lg text-espresso/40 hover:text-burgundy hover:bg-burgundy/10 transition-colors cursor-pointer"
                            title="Delete Bespoke Suite"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: PLATFORM & CONCIERGE SETTINGS                                */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-paper border border-sand-300/80 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-espresso mb-1">
              Global Platform Controls
            </h2>
            <p className="font-sans text-xs text-espresso/70 mb-6">
              Configure concierge contact numbers, WhatsApp booking links, and live announcements.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* WhatsApp Support Number */}
              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-espresso mb-1.5">
                  Concierge WhatsApp Support Number
                </label>
                <input
                  type="text"
                  value={settings.conciergeWhatsApp}
                  onChange={(e) => setSettings({ ...settings, conciergeWhatsApp: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-xs text-espresso focus:outline-hidden focus:border-olive font-mono"
                />
                <span className="text-[10px] font-sans text-espresso/50 block mt-1">
                  Used in the footer and custom design support links for couples.
                </span>
              </div>

              {/* Concierge Email */}
              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-espresso mb-1.5">
                  Concierge Support Email
                </label>
                <input
                  type="email"
                  value={settings.conciergeEmail}
                  onChange={(e) => setSettings({ ...settings, conciergeEmail: e.target.value })}
                  placeholder="concierge@vesna.atelier"
                  className="w-full px-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-xs text-espresso focus:outline-hidden focus:border-olive font-mono"
                />
              </div>

              {/* Pricing & Activation Mode (Mode A) */}
              <div className="p-5 rounded-2xl bg-sand-100/60 border border-sand-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-espresso">
                    Suite Pricing &amp; Activation Mode
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-olive/10 border border-olive/30 text-olive text-[10px] font-sans font-bold uppercase tracking-wider">
                    Mode A (Strict Verification)
                  </span>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-medium text-espresso/80 mb-1">
                    Suite Price (PKR)
                  </label>
                  <input
                    type="text"
                    value={settings.suitePricePkr}
                    onChange={(e) => setSettings({ ...settings, suitePricePkr: e.target.value })}
                    placeholder="2500"
                    className="w-full px-3.5 py-2 rounded-xl bg-paper border border-sand-300 text-xs text-espresso focus:outline-hidden focus:border-olive font-mono"
                  />
                </div>
              </div>

              {/* Direct Payment Accounts (Easypaisa / JazzCash / Bank) */}
              <div className="p-5 rounded-2xl bg-sand-100/60 border border-sand-200 space-y-4">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-espresso block">
                  Direct Transfer Receiving Accounts
                </span>

                {/* Easypaisa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-sans text-[10px] text-espresso/70 mb-1">
                      Easypaisa Account Title
                    </label>
                    <input
                      type="text"
                      value={settings.easypaisa?.accountTitle || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          easypaisa: { ...settings.easypaisa, accountTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-xs text-espresso"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] text-espresso/70 mb-1">
                      Easypaisa Mobile Number
                    </label>
                    <input
                      type="text"
                      value={settings.easypaisa?.accountNumber || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          easypaisa: { ...settings.easypaisa, accountNumber: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-xs text-espresso font-mono"
                    />
                  </div>
                </div>

                {/* JazzCash */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-sand-200">
                  <div>
                    <label className="block font-sans text-[10px] text-espresso/70 mb-1">
                      JazzCash Account Title
                    </label>
                    <input
                      type="text"
                      value={settings.jazzcash?.accountTitle || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          jazzcash: { ...settings.jazzcash, accountTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-xs text-espresso"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] text-espresso/70 mb-1">
                      JazzCash Mobile Number
                    </label>
                    <input
                      type="text"
                      value={settings.jazzcash?.accountNumber || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          jazzcash: { ...settings.jazzcash, accountNumber: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-xs text-espresso font-mono"
                    />
                  </div>
                </div>

                {/* Bank / IBAN */}
                <div className="pt-1 border-t border-sand-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-sans text-[10px] text-espresso/70 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={settings.bankTransfer?.bankName || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankTransfer: { ...settings.bankTransfer, bankName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-xs text-espresso"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] text-espresso/70 mb-1">
                        Bank Account Title
                      </label>
                      <input
                        type="text"
                        value={settings.bankTransfer?.accountTitle || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankTransfer: { ...settings.bankTransfer, accountTitle: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-xs text-espresso"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] text-espresso/70 mb-1">
                      IBAN / Account Number
                    </label>
                    <input
                      type="text"
                      value={settings.bankTransfer?.iban || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bankTransfer: { ...settings.bankTransfer, iban: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-xs text-espresso font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Site-wide Banner */}
              <div className="p-5 rounded-2xl bg-sand-100/60 border border-sand-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-espresso">
                    Top Announcement Banner
                  </span>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, bannerActive: !settings.bannerActive })}
                    className="flex items-center gap-1.5 cursor-pointer text-xs font-sans font-semibold text-olive"
                  >
                    {settings.bannerActive ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-olive" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-sand-400" />
                        <span className="text-espresso/40">Disabled</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-medium text-espresso/80 mb-1">
                    Banner Message
                  </label>
                  <input
                    type="text"
                    value={settings.bannerMessage}
                    onChange={(e) => setSettings({ ...settings, bannerMessage: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-paper border border-sand-300 text-xs text-espresso focus:outline-hidden focus:border-olive"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-bold uppercase tracking-[0.2em] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-gold-400" />
                <span>Save Platform Settings</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                             */}
      {/* ===================================================================== */}
      {inviteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-paper border border-sand-300 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-lg font-bold text-espresso">
              Confirm Permanent Deletion
            </h3>

            <p className="font-sans text-xs text-espresso/70 leading-relaxed">
              Are you sure you want to delete invitation <code className="font-mono text-burgundy font-bold">{inviteToDelete.id}</code>? This cannot be undone and will break the guest link.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setInviteToDelete(null)}
                className="px-4 py-2 rounded-full bg-sand-100 hover:bg-sand-200 text-espresso text-xs font-sans font-semibold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-sans font-bold uppercase tracking-wider shadow-xs cursor-pointer"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CRAFT BESPOKE TEMPLATE SUITE MODAL                                    */}
      {/* ===================================================================== */}
      <AddTemplateModal
        isOpen={isAddTemplateOpen}
        onClose={() => setIsAddTemplateOpen(false)}
        onCreated={(newSuite) => {
          setAllCatalogSuites(getAllTemplates());
          showNotice(`✅ Bespoke suite "${newSuite.name}" successfully crafted & published to catalog!`);
        }}
      />
    </div>
  );
}
