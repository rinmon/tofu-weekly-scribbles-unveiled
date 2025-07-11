export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_usage_stats: {
        Row: {
          created_at: string | null
          date: string | null
          endpoint: string | null
          id: string
          requests_count: number | null
          service: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          endpoint?: string | null
          id?: string
          requests_count?: number | null
          service: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          endpoint?: string | null
          id?: string
          requests_count?: number | null
          service?: string
        }
        Relationships: []
      }
      collected_data: {
        Row: {
          author: string | null
          collected_at: string | null
          content: string | null
          id: string
          issue_id: string | null
          metadata: Json | null
          processed: boolean | null
          source_type: string
          title: string | null
          url: string | null
        }
        Insert: {
          author?: string | null
          collected_at?: string | null
          content?: string | null
          id?: string
          issue_id?: string | null
          metadata?: Json | null
          processed?: boolean | null
          source_type: string
          title?: string | null
          url?: string | null
        }
        Update: {
          author?: string | null
          collected_at?: string | null
          content?: string | null
          id?: string
          issue_id?: string | null
          metadata?: Json | null
          processed?: boolean | null
          source_type?: string
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collected_data_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "weekly_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      post_history: {
        Row: {
          error_message: string | null
          id: string
          issue_id: string | null
          posted_at: string | null
          retry_count: number | null
          status: string | null
          wordpress_post_id: number | null
          wordpress_url: string | null
        }
        Insert: {
          error_message?: string | null
          id?: string
          issue_id?: string | null
          posted_at?: string | null
          retry_count?: number | null
          status?: string | null
          wordpress_post_id?: number | null
          wordpress_url?: string | null
        }
        Update: {
          error_message?: string | null
          id?: string
          issue_id?: string | null
          posted_at?: string | null
          retry_count?: number | null
          status?: string | null
          wordpress_post_id?: number | null
          wordpress_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_history_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "weekly_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          settings: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      weekly_issues: {
        Row: {
          content: Json | null
          created_at: string | null
          created_by: string | null
          end_date: string
          highlights: string[] | null
          id: string
          start_date: string
          status: string | null
          summary: string | null
          title: string
          updated_at: string | null
          week_period: string
          wordpress_post_id: number | null
          wordpress_url: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          end_date: string
          highlights?: string[] | null
          id?: string
          start_date: string
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          week_period: string
          wordpress_post_id?: number | null
          wordpress_url?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string
          highlights?: string[] | null
          id?: string
          start_date?: string
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          week_period?: string
          wordpress_post_id?: number | null
          wordpress_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
