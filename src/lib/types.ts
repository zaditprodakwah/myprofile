export interface SiteContent {
  id: string;
  section_key: string;
  content_type: string;
  value: string;
  metadata?: Record<string, unknown> | null;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon_name: string;
  tags: string[];
  display_order: number;
  size: string;
  is_active: boolean;
  created_at?: string;
}

export interface CaseStudy {
  id: string;
  sector_badge: string;
  client_name: string;
  challenge: string;
  approach: string;
  metrics: Array<{ label: string; value: string; number: number }>;
  testimonial_text?: string;
  testimonial_author?: string;
  testimonial_role?: string;
  tech_tags: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  target_niche?: string;
  created_at?: string;
}

export interface Entity {
  id: string;
  city_id?: string;
  city_slug: string;
  entity_type: 'individual' | 'institution' | 'agency' | 'brand' | 'product' | 'service';
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  contact_phone?: string;
  contact_email?: string;
  website_url?: string;
  logo_url?: string;
  address?: string;
  google_maps_url?: string;
  verification_status: 'unverified' | 'claimed' | 'verified';
  trust_score: number;
  affiliate_url?: string;
  claim_token?: string;
  raw_metadata?: Record<string, unknown> | null;
  created_at?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  source_feed?: string;
  original_url?: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  semantic_keywords?: string[];
  faq_items?: Array<{ question: string; answer: string }>;
  author_name?: string;
  is_published: boolean;
  published_at?: string;
  updated_at?: string;
}

export interface SystemConfig {
  key: string;
  value: unknown;
  description?: string;
  updated_at?: string;
}

export interface PAAQuestion {
  id: string;
  keyword: string;
  question: string;
  answer: string;
  article_id?: string;
  created_at?: string;
}

export interface UtilityLead {
  id: string;
  lead_name: string;
  contact_info: { whatsapp: string; email?: string };
  target_site_url?: string;
  audit_category: string;
  accessibility_score?: number;
  narrative_score?: number;
  status: 'PENDING' | 'CONTACTED' | 'WON';
  created_at?: string;
}

export interface DirectoryLead {
  id: string;
  entity_id?: string;
  lead_name: string;
  contact_info: { whatsapp: string; email?: string; role: string };
  target_site_url?: string;
  audit_category?: string;
  status: 'PENDING' | 'CONTACTED' | 'WON';
  created_at?: string;
}

export interface ContactLead {
  id: string;
  visitor_type?: string;
  needs: string[];
  project_description?: string;
  lead_name: string;
  contact_info: { whatsapp: string; email?: string };
  status: 'PENDING' | 'CONTACTED' | 'WON';
  created_at?: string;
}
