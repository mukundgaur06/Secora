export type CybersecurityMode =
  | 'GENERAL'
  | 'LEARNING'
  | 'DEFENSIVE'
  | 'TROUBLESHOOTING'
  | 'CTF'
  | 'CODE_REVIEW';

export interface UserPlan {
  plan: string;
  monthly_token_limit: number;
  tokens_used: number;
  tokens_remaining: number;
  reset_date: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  created_at: string;
  plan?: UserPlan;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  token_count: number;
  security_metadata?: {
    topic?: string;
    category?: string;
    difficulty?: string;
    mode?: string;
    sources?: string[];
  } | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  mode: CybersecurityMode;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  message_count?: number;
  messages?: Message[];
}

export interface HealthComponent {
  status: 'healthy' | 'standby' | 'degraded' | 'offline';
  details: string;
  latency_ms: number;
}

export interface HealthStatus {
  status: 'healthy' | 'operational' | 'degraded' | 'critical';
  timestamp: string;
  version: string;
  components: {
    database: HealthComponent;
    ai_engine: HealthComponent;
    rag_core: HealthComponent;
    api_gateway: HealthComponent;
  };
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  source: string;
  category: string;
  url?: string;
  version: string;
  tags: string[];
  summary: string;
  content?: string;
  created_at: string;
}

export interface Lab {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  learning_objectives: string;
  instructions: string;
  hints?: string;
  solution?: string;
  created_at: string;
}

export interface UsageSummary {
  tokens_used: number;
  monthly_limit: number;
  tokens_remaining: number;
  percentage_used: number;
  request_count: number;
  avg_tokens_per_request: number;
  current_model: string;
  reset_date: string;
  daily_history: Array<{ day: string; tokens: number }>;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  total_tokens_consumed: number;
  total_requests: number;
  audit_events_logged: number;
  system_status: string;
  llm_costs_estimated_usd: number;
  error_rate_percent: number;
  avg_latency_ms: number;
}
