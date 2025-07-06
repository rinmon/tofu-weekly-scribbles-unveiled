import { createClient } from '@supabase/supabase-js'

// Supabase設定（Lovableで自動設定される環境変数を使用）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 型定義
export interface WeeklyIssue {
  id: string
  title: string
  week_period: string
  start_date: string
  end_date: string
  summary: string | null
  content: any | null
  highlights: string[] | null
  status: 'draft' | 'published' | 'archived'
  wordpress_post_id: number | null
  wordpress_url: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface CollectedData {
  id: string
  source_type: 'discord' | 'youtube' | 'website' | 'template'
  title: string | null
  content: string | null
  url: string | null
  author: string | null
  metadata: any
  collected_at: string
  processed: boolean
  issue_id: string | null
}

export interface PostHistory {
  id: string
  issue_id: string
  wordpress_post_id: number | null
  wordpress_url: string | null
  posted_at: string
  status: 'success' | 'failed' | 'pending'
  error_message: string | null
  retry_count: number
}

export interface UserSettings {
  id: string
  user_id: string
  settings: {
    notifications?: {
      discord?: boolean
      email?: boolean
      slack?: boolean
    }
    automation?: {
      auto_collect?: boolean
      auto_publish?: boolean
      collection_frequency?: string
    }
    wordpress?: {
      site_url?: string
      username?: string
      application_password?: string
    }
  }
  created_at: string
  updated_at: string
}