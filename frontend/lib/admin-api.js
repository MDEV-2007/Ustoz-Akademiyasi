/**
 * Ustoz Akademiyasi — Enterprise Admin API Client
 * Connects the Admin Dashboard with NestJS Backend (/api/v1)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class AdminApiError extends Error {
  constructor(message, statusCode, data = {}) {
    super(Array.isArray(message) ? message.join(', ') : message);
    this.name = 'AdminApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

// LocalStorage token helpers (safe on SSR)
export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ua_admin_token') || null;
}

export function setStoredToken(token, user) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('ua_admin_token', token);
  if (user) localStorage.setItem('ua_admin_user', JSON.stringify(user));
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('ua_admin_user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ua_admin_token');
  localStorage.removeItem('ua_admin_user');
}

export async function adminFetch(endpoint, options = {}) {
  const token = options.token || getStoredToken();
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || 'no-store',
    });

    // Handle CSV or text responses
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
      if (!res.ok) throw new AdminApiError(`Eksportda xatolik (${res.status})`, res.status);
      return await res.text();
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined') {
        // Token expired or invalid
        // Don't auto-redirect on login check
      }
      const msg = data?.message || `So‘rovda xatolik (${res.status})`;
      throw new AdminApiError(msg, res.status, data);
    }

    return data?.data !== undefined ? data.data : data;
  } catch (err) {
    if (err instanceof AdminApiError) throw err;
    console.error(`[AdminApi Error] ${endpoint}:`, err.message);
    throw new AdminApiError(
      'Serverga ulanishda xatolik yuz berdi. Backend ishlayotganini tekshiring.',
      0,
      { originalError: err.message }
    );
  }
}

export const AdminApi = {
  // Authentication
  auth: {
    login: async (email, password) => {
      const res = await adminFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res?.accessToken) {
        setStoredToken(res.accessToken, res.user);
      }
      return res;
    },
    me: async () => {
      return adminFetch('/auth/me');
    },
    logout: async () => {
      try {
        await adminFetch('/auth/logout', { method: 'POST' });
      } finally {
        clearStoredAuth();
      }
    },
  },

  // Analytics & Dashboard
  analytics: {
    getDashboard: async (startDate, endDate) => {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      const query = params.toString() ? `?${params.toString()}` : '';
      return adminFetch(`/admin/analytics/dashboard${query}`);
    },
  },

  // CRM - Leads & Registrations
  leads: {
    list: async (filters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
          params.set(k, String(v));
        }
      });
      const query = params.toString() ? `?${params.toString()}` : '';
      return adminFetch(`/admin/leads${query}`);
    },
    get: async (id) => adminFetch(`/admin/leads/${id}`),
    updateStatus: async (id, status, comment) =>
      adminFetch(`/admin/leads/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, comment }),
      }),
    assignManager: async (id, managerId) =>
      adminFetch(`/admin/leads/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ managerId }),
      }),
    updateNotes: async (id, notes) =>
      adminFetch(`/admin/leads/${id}/notes`, {
        method: 'PATCH',
        body: JSON.stringify({ internalNotes: notes }),
      }),
    exportCsvUrl: (filters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v && v !== 'ALL') params.set(k, String(v));
      });
      return `${API_BASE}/admin/leads/export/csv?${params.toString()}`;
    },
    retryNotification: async (id) =>
      adminFetch(`/admin/leads/${id}/retry-notification`, {
        method: 'POST',
      }),
  },

  // Academy - Courses
  courses: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return adminFetch(`/admin/courses${q ? `?${q}` : ''}`);
    },
    get: async (id) => adminFetch(`/admin/courses/${id}`),
    create: async (data) =>
      adminFetch('/admin/courses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: async (id, data) =>
      adminFetch(`/admin/courses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: async (id) =>
      adminFetch(`/admin/courses/${id}`, {
        method: 'DELETE',
      }),
  },

  // Academy - Branches
  branches: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return adminFetch(`/admin/branches${q ? `?${q}` : ''}`);
    },
    get: async (id) => adminFetch(`/admin/branches/${id}`),
    create: async (data) =>
      adminFetch('/admin/branches', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: async (id, data) =>
      adminFetch(`/admin/branches/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: async (id) =>
      adminFetch(`/admin/branches/${id}`, {
        method: 'DELETE',
      }),
  },

  // Academy - Teachers
  teachers: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return adminFetch(`/admin/teachers${q ? `?${q}` : ''}`);
    },
    get: async (id) => adminFetch(`/admin/teachers/${id}`),
    create: async (data) =>
      adminFetch('/admin/teachers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: async (id, data) =>
      adminFetch(`/admin/teachers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: async (id) =>
      adminFetch(`/admin/teachers/${id}`, {
        method: 'DELETE',
      }),
  },

  // Academy - Schedules
  schedules: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return adminFetch(`/admin/schedules${q ? `?${q}` : ''}`);
    },
    create: async (data) =>
      adminFetch('/admin/schedules', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: async (id, data) =>
      adminFetch(`/admin/schedules/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: async (id) =>
      adminFetch(`/admin/schedules/${id}`, {
        method: 'DELETE',
      }),
  },

  // Website CMS - Articles
  articles: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return adminFetch(`/admin/articles${q ? `?${q}` : ''}`);
    },
    get: async (id) => adminFetch(`/admin/articles/${id}`),
    create: async (data) =>
      adminFetch('/admin/articles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: async (id, data) =>
      adminFetch(`/admin/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: async (id) =>
      adminFetch(`/admin/articles/${id}`, {
        method: 'DELETE',
      }),
  },

  // Website CMS - FAQ
  faq: {
    list: async () => adminFetch('/admin/faqs'),
    create: async (data) =>
      adminFetch('/admin/faqs', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: async (id, data) =>
      adminFetch(`/admin/faqs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: async (id) =>
      adminFetch(`/admin/faqs/${id}`, {
        method: 'DELETE',
      }),
  },

  // Website CMS - Media
  media: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return adminFetch(`/admin/media${q ? `?${q}` : ''}`);
    },
    delete: async (id) =>
      adminFetch(`/admin/media/${id}`, {
        method: 'DELETE',
      }),
  },

  // System - Users & Staff
  users: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return adminFetch(`/admin/users${q ? `?${q}` : ''}`);
    },
    create: async (data) =>
      adminFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: async (id, data) =>
      adminFetch(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: async (id) =>
      adminFetch(`/admin/users/${id}`, {
        method: 'DELETE',
      }),
  },

  // System - Audit Logs
  auditLogs: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return adminFetch(`/admin/audit-logs${q ? `?${q}` : ''}`);
    },
  },

  // System - Settings & Bot Configuration
  settings: {
    list: async () => adminFetch('/admin/settings'),
    update: async (key, value, description, isPublic = true) =>
      adminFetch(`/admin/settings/${key}`, {
        method: 'PATCH',
        body: JSON.stringify({ value, description, isPublic }),
      }),
  },

  // Health
  health: {
    check: async () => adminFetch('/health/live'),
  },
};

export default AdminApi;
