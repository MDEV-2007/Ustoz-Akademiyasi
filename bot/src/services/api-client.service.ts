import { getConfig } from '../config/env.config';
import {
  ApiResponse,
  Branch,
  Teacher,
  Course,
  CreateRegistrationPayload,
  FAQ,
  Article,
  SiteSettings,
  RegistrationResult,
  LeadAdminItem,
} from '../types/api.types';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClientService {
  private baseUrl: string;
  private botApiToken: string;
  private timeoutMs: number = 8000;

  constructor(baseUrl?: string, botApiToken?: string) {
    const config = getConfig();
    this.baseUrl = (baseUrl || config.BACKEND_API_URL).replace(/\/$/, '');
    this.botApiToken = botApiToken || config.BOT_API_TOKEN;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-source': 'telegram-bot',
      ...(options.headers as Record<string, string>),
    };

    if (this.botApiToken) {
      headers['x-bot-api-token'] = this.botApiToken;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      const responseText = await response.text();
      let parsed: any;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = { message: responseText };
      }

      if (!response.ok) {
        const errorMsg = Array.isArray(parsed?.message)
          ? parsed.message.join(', ')
          : (parsed?.message || parsed?.error || `HTTP ${response.status} xatolik yuz berdi`);
        throw new ApiError(response.status, errorMsg, parsed);
      }

      // Backend wraps payloads in { success: true, data: ..., meta?: ... }
      if (parsed && typeof parsed === 'object' && 'data' in parsed) {
        return parsed.data as T;
      }
      return parsed as T;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      if (err.name === 'AbortError') {
        throw new ApiError(408, "Server bilan aloqa vaqti tugadi (Timeout). Iltimos, qaytadan urinib ko‘ring.");
      }
      throw new ApiError(500, `API bilan ulanishda kutilmagan xatolik: ${err.message}`);
    } finally {
      clearTimeout(timeout);
    }
  }

  // 1. Courses
  async getCourses(params?: { category?: string; search?: string; limit?: number }): Promise<Course[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.limit) query.append('limit', params.limit.toString());
    const queryString = query.toString() ? `?${query.toString()}` : '';

    return this.request<Course[]>(`/public/courses${queryString}`);
  }

  async getCourseBySlug(slug: string): Promise<Course> {
    return this.request<Course>(`/public/courses/${encodeURIComponent(slug)}`);
  }

  // 2. Branches
  async getBranches(params?: { search?: string; area?: string }): Promise<Branch[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.area) query.append('area', params.area);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    return this.request<Branch[]>(`/public/branches${queryString}`);
  }

  async getBranchBySlug(slug: string): Promise<Branch> {
    return this.request<Branch>(`/public/branches/${encodeURIComponent(slug)}`);
  }

  // 3. Teachers & Departments
  async getTeachers(): Promise<Teacher[]> {
    return this.request<Teacher[]>('/public/teachers');
  }

  async getTeacherBySlug(slug: string): Promise<Teacher> {
    return this.request<Teacher>(`/public/teachers/${encodeURIComponent(slug)}`);
  }

  // 4. Trial Registration
  async createTrialRegistration(payload: CreateRegistrationPayload): Promise<RegistrationResult> {
    return this.request<RegistrationResult>('/public/trial-registrations', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        source: payload.source || 'TELEGRAM_BOT',
      }),
    });
  }

  // 4. FAQs
  async getFaqs(category?: string): Promise<FAQ[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<FAQ[]>(`/public/faqs${query}`);
  }

  // 5. Educational Articles
  async getArticles(params?: { topic?: string; search?: string; limit?: number }): Promise<Article[]> {
    const query = new URLSearchParams();
    if (params?.topic) query.append('topic', params.topic);
    if (params?.search) query.append('search', params.search);
    if (params?.limit) query.append('limit', params.limit.toString());
    const queryString = query.toString() ? `?${query.toString()}` : '';

    return this.request<Article[]>(`/public/articles${queryString}`);
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    return this.request<Article>(`/public/articles/${encodeURIComponent(slug)}`);
  }

  // 6. Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    return this.request<SiteSettings>('/public/site-settings');
  }

  // 7. Admin: Leads
  async getAdminLeads(page: number = 1, limit: number = 5, status?: string): Promise<{ data: LeadAdminItem[]; meta: any }> {
    const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) query.append('status', status);

    const url = `${this.baseUrl}/admin/leads?${query.toString()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-bot-api-token': this.botApiToken,
          'x-source': 'telegram-bot-admin',
        },
        signal: controller.signal,
      });

      const parsed: any = await response.json();
      if (!response.ok) {
        throw new ApiError(response.status, parsed?.message || 'Arizalarni yuklab bo‘lmadi');
      }

      return {
        data: parsed.data || [],
        meta: parsed.meta || {},
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  // 8. Admin: Update Status
  async updateLeadStatus(
    id: string,
    status: string,
    comment?: string,
    operatorName?: string,
  ): Promise<any> {
    return this.request(`/admin/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment, operatorName }),
    });
  }

  // 9. Admin: Get Single Lead Details
  async getLeadById(id: string): Promise<any> {
    return this.request(`/admin/leads/${id}`);
  }
}

export const apiClient = new ApiClientService();
