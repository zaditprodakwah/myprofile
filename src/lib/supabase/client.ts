import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for the database based on schema.sql
export type Database = {
  public: {
    Tables: {
      inquiries: {
        Row: {
          id: string;
          created_at: string;
          segment: "marketing" | "academic" | "business";
          goal: string | null;
          challenges: string | null;
          urgency: "today" | "this_week" | "this_month" | "flexible" | null;
          budget_range: string | null;
          deadline_date: string | null;
          full_name: string;
          email: string | null;
          whatsapp: string | null;
          company: string | null;
          role: string | null;
          source: string | null;
          campaign: string | null;
          referrer: string | null;
          landing_path: string | null;
          lead_score: number | null;
          lead_tier: string | null;
          routing: string | null;
          status: string | null;
          notes: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["inquiries"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          created_at: string;
          session_id: string | null;
          event_name: string;
          segment: string | null;
          path: string | null;
          referrer: string | null;
          user_agent: string | null;
          utm_source: string | null;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_term: string | null;
          utm_content: string | null;
          metadata: any | null;
        };
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
      };
      radar_items: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          slug: string;
          title: string;
          url: string;
          source_name: string;
          source_url: string;
          published_at: string;
          summary: string;
          why_it_matters: string;
          takeaway: string;
          recommended_service: string | null;
          tags: string[];
          image_url: string | null;
          content_hash: string;
          is_featured: boolean;
          signal_score: number;
        };
        Insert: Omit<Database["public"]["Tables"]["radar_items"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tools: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          slug: string;
          name: string;
          tagline: string;
          description: string;
          category: string;
          sub_category: string | null;
          pricing_model: string;
          website_url: string;
          affiliate_url: string | null;
          logo_url: string | null;
          og_image_url: string | null;
          features: string[];
          use_cases: string[];
          pros: string[];
          cons: string[];
          rating: number;
          is_featured: boolean;
          is_sponsored: boolean;
          sponsored_until: string | null;
          priority: number;
          status: string;
          seo_title: string | null;
          seo_description: string | null;
          keywords: string[];
          schema_type: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tools"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      affiliate_clicks: {
        Row: {
          id: string;
          created_at: string;
          tool_id: string;
          tool_slug: string;
          page_path: string;
          mode: string | null;
          referrer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          ip_hash: string | null;
          user_agent: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["affiliate_clicks"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
      };
      industries: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          icon: string | null;
        };
      };
      problems: {
        Row: {
          id: string;
          industry_slug: string;
          slug: string;
          title: string;
          problem_statement: string[];
          root_causes: string[];
          solution_framework: any;
          faq: any[];
        };
      };
    };
  };
};
