import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local persistent store keys for offline / demo mode
const LOCAL_STORAGE_KEY = 'shadii_platform_invitations';
const LOCAL_RSVP_KEY = 'shadii_platform_rsvps';

// In-memory fallback for server-side execution if no Supabase configured
if (typeof globalThis !== 'undefined' && !globalThis.__SHADII_STORE__) {
  globalThis.__SHADII_STORE__ = new Map();
}
if (typeof globalThis !== 'undefined' && !globalThis.__SHADII_RSVPS__) {
  globalThis.__SHADII_RSVPS__ = new Map();
}

const getStore = () => {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }
  return Object.fromEntries(globalThis.__SHADII_STORE__ || []);
};

const setStore = (store) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
    } catch (e) {}
  } else if (globalThis.__SHADII_STORE__) {
    globalThis.__SHADII_STORE__ = new Map(Object.entries(store));
  }
};

const getRsvpStore = () => {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(LOCAL_RSVP_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
  return Array.from(globalThis.__SHADII_RSVPS__?.values() || []);
};

const setRsvpStore = (list) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_RSVP_KEY, JSON.stringify(list));
    } catch (e) {}
  } else if (globalThis.__SHADII_RSVPS__) {
    globalThis.__SHADII_RSVPS__ = new Map(list.map((r) => [r.id, r]));
  }
};

/**
 * Save or update an invitation
 */
export async function saveInvitation(invitation) {
  const record = {
    ...invitation,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('invitations')
      .upsert({
        id: record.id,
        template_id: record.template_id,
        title: record.title || 'Wedding Invitation',
        event_type: record.event_type || 'nikkah',
        status: record.status || 'draft',
        user_id: record.user_id || null,
        data: record.data,
        media: record.media || {},
        updated_at: record.updated_at,
        published_at: record.published_at || null,
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase save error, falling back to local store:', error.message);
    } else {
      return data;
    }
  }

  // Fallback to local / memory store
  const store = getStore();
  store[record.id] = record;
  setStore(store);
  return record;
}

/**
 * Fetch an invitation by unique ID or slug
 */
export async function getInvitationById(id) {
  if (!id) return null;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  }

  // Fallback
  const store = getStore();
  return store[id] || null;
}

/**
 * List all invitations for current device or authenticated user
 */
export async function listUserInvitations(userId = null) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('invitations').select('*').order('updated_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;

    if (!error && data) {
      return data;
    }
  }

  const store = getStore();
  const all = Object.values(store);
  if (userId) {
    const userOnly = all.filter((item) => item.user_id === userId || !item.user_id);
    return userOnly.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }
  return all.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

/**
 * Delete an invitation
 */
export async function deleteInvitation(id) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('invitations').delete().eq('id', id);
  }
  const store = getStore();
  delete store[id];
  setStore(store);
  return true;
}

/**
 * Submit guest RSVP
 */
export async function submitRsvp(rsvpData) {
  const record = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...rsvpData,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('rsvps')
      .insert({
        invitation_id: record.invitation_id,
        guest_name: record.guest_name,
        guest_phone: record.guest_phone || null,
        attendance: record.attendance || 'attending',
        guest_count: record.guest_count ? parseInt(record.guest_count, 10) : 1,
        notes: record.notes || null,
      })
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  }

  // Fallback to local store
  const store = getRsvpStore();
  store.push(record);
  setRsvpStore(store);
  return record;
}

/**
 * List all RSVPs for an invitation
 */
export async function listRsvpsForInvitation(invitationId) {
  if (!invitationId) return [];

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data;
    }
  }

  // Fallback
  const store = getRsvpStore();
  return store
    .filter((r) => r.invitation_id === invitationId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

const SETTINGS_KEY = 'vesna_platform_settings';
const LOCAL_ORDERS_KEY = 'vesna_platform_orders';

const DEFAULT_SETTINGS = {
  conciergeWhatsApp: '+92 300 8472911',
  conciergeEmail: 'concierge@vesna.atelier',
  bannerActive: true,
  bannerMessage: 'Winter Wedding Season: Enjoy Complimentary 3D Gold Foil Shimmer on All 15 Suites',
  bannerLink: '/templates',
  suitePricePkr: '2500',
  currency: 'PKR',
  paymentMode: 'strict', // Mode A: Concierge verification required
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
};

/**
 * Super Admin: List all invitations platform-wide
 */
export async function listAllInvitationsForAdmin() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  }

  // Fallback to local store with initial demo data if empty
  let store = getStore();
  if (Object.keys(store).length === 0) {
    // Seed initial realistic invitations for demo/dev exploration
    const initialSeed = {
      'inv_fatima_sharjeel': {
        id: 'inv_fatima_sharjeel',
        template_id: 'royal-burgundy-barat',
        title: "Fatima & Sharjeel's Grand Barat",
        event_type: 'wedding',
        status: 'published',
        published_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        data: {
          bride_name: 'Fatima Noor',
          groom_name: 'Sharjeel Khan',
          event_title: 'The Grand Barat Ceremony',
          event_date_display: 'Saturday, November 7, 2026',
          venue_name: 'The Grand Palm Royale, Lahore',
          hero_image: '/assets/barat-stage-venue.jpg',
        },
        media: {},
      },
      'inv_ayesha_hamza': {
        id: 'inv_ayesha_hamza',
        template_id: 'noor-walima',
        title: "Ayesha & Hamza's Walima Reception",
        event_type: 'wedding',
        status: 'published',
        published_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        data: {
          bride_name: 'Ayesha Siddiqui',
          groom_name: 'Hamza Tariq',
          event_title: 'The Walima Reception',
          event_date_display: 'Sunday, November 8, 2026',
          venue_name: 'Pearl Continental Crystal Ballroom',
          hero_image: '/assets/walima-venue.jpg',
        },
        media: {},
      },
      'inv_zara_mehndi': {
        id: 'inv_zara_mehndi',
        template_id: 'festive-mehndi',
        title: "Zara's Rung-e-Mehndi",
        event_type: 'wedding',
        status: 'draft',
        published_at: null,
        updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        data: {
          bride_name: 'Zara Ahmed',
          groom_name: 'Daniyal Malik',
          event_title: 'Rung-e-Mehndi & Sangeet',
          event_date_display: 'Friday, November 6, 2026',
          venue_name: 'Haveli Barood Khana, Lahore',
          hero_image: '/assets/qawwali-hero.jpg',
        },
        media: {},
      },
    };
    setStore(initialSeed);
    store = initialSeed;
  }

  return Object.values(store).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

/**
 * Super Admin: Toggle or set invitation status (published / draft / archived)
 */
export async function updateInvitationStatus(id, newStatus) {
  if (isSupabaseConfigured && supabase) {
    const payload = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (newStatus === 'published') {
      payload.published_at = new Date().toISOString();
    }
    await supabase.from('invitations').update(payload).eq('id', id);
  }

  const store = getStore();
  if (store[id]) {
    store[id].status = newStatus;
    store[id].updated_at = new Date().toISOString();
    if (newStatus === 'published' && !store[id].published_at) {
      store[id].published_at = new Date().toISOString();
    }
    setStore(store);
    return store[id];
  }
  return null;
}

/**
 * Super Admin: List all RSVPs platform-wide
 */
export async function listAllRsvpsForAdmin() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data;
    }
  }

  let store = getRsvpStore();
  if (store.length === 0) {
    const demoRsvps = [
      {
        id: 'rsvp_demo_1',
        invitation_id: 'inv_fatima_sharjeel',
        guest_name: 'Tariq & Family',
        guest_phone: '+92 321 4455667',
        attendance: 'attending',
        guest_count: 4,
        notes: 'Delighted to attend the Barat celebrations!',
        created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        id: 'rsvp_demo_2',
        invitation_id: 'inv_fatima_sharjeel',
        guest_name: 'Dr. Asad Mansoor',
        guest_phone: '+92 300 8912345',
        attendance: 'attending',
        guest_count: 2,
        notes: 'Warmest congratulations to both families.',
        created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
      },
      {
        id: 'rsvp_demo_3',
        invitation_id: 'inv_ayesha_hamza',
        guest_name: 'Usman Qureshi',
        guest_phone: '+92 333 1122334',
        attendance: 'attending',
        guest_count: 2,
        notes: null,
        created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ];
    setRsvpStore(demoRsvps);
    store = demoRsvps;
  }

  return store.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Super Admin: Get platform settings
 */
export function getPlatformSettings() {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
}

/**
 * Super Admin: Save platform settings
 */
export function savePlatformSettings(newSettings) {
  if (typeof window !== 'undefined') {
    try {
      const merged = { ...DEFAULT_SETTINGS, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      return merged;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
}

/**
 * Submit Payment Proof for Invitation (Mode A: Strict Activation)
 */
export async function submitPaymentProof(orderData) {
  const record = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    invitation_id: orderData.invitationId,
    couple_name: orderData.coupleName || 'Couple Celebration',
    suite_name: orderData.suiteName || 'Atelier Suite',
    amount: orderData.amount || 'PKR 2,500',
    method: orderData.method || 'easypaisa', // 'easypaisa' | 'jazzcash' | 'bank_transfer'
    trx_id: orderData.trxId || '',
    sender_name: orderData.senderName || '',
    sender_phone: orderData.senderPhone || '',
    status: 'pending', // 'pending' | 'verified' | 'rejected'
    notes: orderData.notes || '',
    created_at: new Date().toISOString(),
  };

  // Update invitation status to pending_payment
  await updateInvitationStatus(orderData.invitationId, 'pending_payment');

  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
      existing.unshift(record);
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(existing));
    } catch (e) {}
  }

  return record;
}

/**
 * Super Admin: List all payment orders
 */
export async function listAllOrdersForAdmin() {
  let list = [];
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
      list = raw ? JSON.parse(raw) : [];
    } catch (e) {
      list = [];
    }
  }

  // Seed sample initial order for testing if empty
  if (list.length === 0) {
    list = [
      {
        id: 'ord_demo_9821',
        invitation_id: 'inv_fatima_sharjeel',
        couple_name: 'Fatima & Sharjeel',
        suite_name: 'Royal Burgundy Barat',
        amount: 'PKR 2,500',
        method: 'easypaisa',
        trx_id: 'EP982140182',
        sender_name: 'Sharjeel Khan',
        sender_phone: '0300 1234567',
        status: 'verified',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: 'ord_demo_4412',
        invitation_id: 'inv_zara_mehndi',
        couple_name: 'Zara & Daniyal',
        suite_name: 'Festive Mehndi',
        amount: 'PKR 2,500',
        method: 'jazzcash',
        trx_id: 'JC441209841',
        sender_name: 'Daniyal Malik',
        sender_phone: '0321 9876543',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(list));
      } catch (e) {}
    }
  }

  return list;
}

/**
 * Super Admin: Verify and Activate Order (Mode A)
 * Instantly publishes the invitation
 */
export async function verifyAndActivateOrder(orderId, invitationId) {
  // 1. Activate invitation
  await updateInvitationStatus(invitationId, 'published');

  // 2. Mark order as verified
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
      if (raw) {
        const orders = JSON.parse(raw);
        const updated = orders.map((o) =>
          o.id === orderId ? { ...o, status: 'verified', verified_at: new Date().toISOString() } : o
        );
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
      }
    } catch (e) {}
  }

  return true;
}

/**
 * Super Admin: Reject Order
 */
export async function rejectOrder(orderId, invitationId) {
  await updateInvitationStatus(invitationId, 'draft');

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
      if (raw) {
        const orders = JSON.parse(raw);
        const updated = orders.map((o) =>
          o.id === orderId ? { ...o, status: 'rejected', rejected_at: new Date().toISOString() } : o
        );
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
      }
    } catch (e) {}
  }

  return true;
}
