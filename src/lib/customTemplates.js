import customTemplatesData from '@/data/customTemplates.json';

const STORAGE_KEY = 'vesna_custom_templates';

/**
 * Get all custom templates synchronously (for initial SSR / static rendering)
 */
export function getCustomTemplatesSync() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with customTemplatesData to ensure no duplicates
          const map = new Map();
          customTemplatesData.forEach((t) => map.set(t.id, t));
          parsed.forEach((t) => map.set(t.id, t));
          return Array.from(map.values());
        }
      }
    } catch (e) {
      console.warn('Error reading local custom templates:', e);
    }
  }

  return Array.isArray(customTemplatesData) ? customTemplatesData : [];
}

/**
 * Fetch all custom templates asynchronously (syncs with API)
 */
export async function fetchCustomTemplates() {
  if (typeof window === 'undefined') {
    return getCustomTemplatesSync();
  }

  try {
    const res = await fetch('/api/templates');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch from /api/templates, falling back to local:', err);
  }

  return getCustomTemplatesSync();
}

/**
 * Create a new custom template
 */
export async function createCustomTemplate(templatePayload) {
  try {
    const res = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templatePayload),
    });

    if (res.ok) {
      const created = await res.json();
      // Update local storage
      const current = getCustomTemplatesSync();
      const updated = [created, ...current.filter((t) => t.id !== created.id)];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return created;
    }
  } catch (err) {
    console.warn('Failed to post to /api/templates:', err);
  }

  // Fallback to local storage if API fails
  const id = templatePayload.id || `suite-${Date.now()}`;
  const record = { ...templatePayload, id, isCustom: true, created_at: new Date().toISOString() };
  const current = getCustomTemplatesSync();
  const updated = [record, ...current.filter((t) => t.id !== id)];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return record;
}

/**
 * Delete a custom template
 */
export async function removeCustomTemplate(id) {
  try {
    await fetch(`/api/templates?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Failed to delete from /api/templates:', err);
  }

  if (typeof window !== 'undefined') {
    const current = getCustomTemplatesSync();
    const updated = current.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return true;
}
