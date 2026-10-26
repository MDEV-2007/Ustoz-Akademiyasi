/**
 * Ustoz Akademiyasi Production API Client
 * Connects the Next.js frontend with the NestJS REST API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  constructor(message, statusCode, data = {}) {
    super(Array.isArray(message) ? message.join(', ') : message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || 'no-store',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `API so‘rovida xatolik (${response.status})`;
      throw new ApiError(errorMsg, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw new ApiError(
      'Server bilan aloqa bog‘lanmadi. Iltimos, keyinroq qayta urinib ko‘ring.',
      0,
      { originalError: error.message }
    );
  }
}

export const UstozApi = {
  // Public Content APIs
  courses: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await apiRequest(`/public/courses${q ? `?${q}` : ''}`);
      return res?.data || [];
    },
    featured: async () => {
      const res = await apiRequest('/public/courses/featured');
      return res?.data || [];
    },
    get: async (slug) => {
      const res = await apiRequest(`/public/courses/${slug}`);
      return res?.data || null;
    },
    categories: async () => {
      const res = await apiRequest('/public/course-categories');
      return res?.data || [];
    },
  },

  branches: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await apiRequest(`/public/branches${q ? `?${q}` : ''}`);
      return res?.data || [];
    },
    get: async (slug) => {
      const res = await apiRequest(`/public/branches/${slug}`);
      return res?.data || null;
    },
  },

  teachers: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await apiRequest(`/public/teachers${q ? `?${q}` : ''}`);
      return res?.data || [];
    },
    get: async (slug) => {
      const res = await apiRequest(`/public/teachers/${slug}`);
      return res?.data || null;
    },
  },

  articles: {
    list: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await apiRequest(`/public/articles${q ? `?${q}` : ''}`);
      return res?.data || [];
    },
    get: async (slug) => {
      const res = await apiRequest(`/public/articles/${slug}`);
      return res?.data || null;
    },
  },

  faqs: {
    list: async () => {
      const res = await apiRequest('/public/faqs');
      return res?.data || [];
    },
  },

  settings: {
    get: async () => {
      const res = await apiRequest('/public/site-settings');
      return res?.data || null;
    },
  },

  // Trial Registration
  registrations: {
    create: (payload) =>
      apiRequest('/public/trial-registrations', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // Convenience Aliases
  getCourses: () => UstozApi.courses.list(),
  getBranches: () => UstozApi.branches.list(),
  getTeachers: () => UstozApi.teachers.list(),
  getArticles: () => UstozApi.articles.list(),
  getFaqs: () => UstozApi.faqs.list(),
  getSettings: () => UstozApi.settings.get(),
};

export default UstozApi;
