import {
  AuthResponse,
  User,
  Conversation,
  HealthStatus,
  KnowledgeDocument,
  Lab,
  UsageSummary,
  AdminStats,
} from '../types';

const API_BASE = '/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('secora_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('secora_token', token);
    } else {
      localStorage.removeItem('secora_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('secora_token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // If unauthorized, clear stored token
      this.setToken(null);
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // fallback to status text
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // --- Auth Endpoints ---
  async login(username_or_email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username_or_email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getMe(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // --- Health & Telemetry ---
  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health');
  }

  // --- Conversations ---
  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/conversations');
  }

  async createConversation(title?: string, mode?: string): Promise<Conversation> {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title, mode }),
    });
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.request<Conversation>(`/conversations/${id}`);
  }

  async deleteConversation(id: string): Promise<void> {
    return this.request<void>(`/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Usage ---
  async getUsage(): Promise<UsageSummary> {
    return this.request<UsageSummary>('/usage');
  }

  // --- Knowledge & Labs ---
  async getKnowledge(category?: string): Promise<KnowledgeDocument[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<KnowledgeDocument[]>(`/knowledge${query}`);
  }

  async getLabs(): Promise<Lab[]> {
    return this.request<Lab[]>('/labs');
  }

  async getLab(slug: string): Promise<Lab> {
    return this.request<Lab>(`/labs/${slug}`);
  }

  // --- Admin ---
  async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>('/admin/stats');
  }

  async getAdminUsers(): Promise<User[]> {
    return this.request<User[]>('/admin/users');
  }
}

export const api = new ApiService();
