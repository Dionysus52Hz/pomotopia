export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      customizations_catalog: {
        Row: {
          category: string
          code: string | null
          created_at: string
          description: string | null
          id: number
          is_premium: boolean | null
          preview_url: string | null
          public_id: string
          sub_category: string | null
        }
        Insert: {
          category: string
          code?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_premium?: boolean | null
          preview_url?: string | null
          public_id?: string
          sub_category?: string | null
        }
        Update: {
          category?: string
          code?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_premium?: boolean | null
          preview_url?: string | null
          public_id?: string
          sub_category?: string | null
        }
        Relationships: []
      }
      item_grades: {
        Row: {
          base_exp: number
          created_at: string
          exp_multiplier: number
          id: number
          max_level: number
          public_id: string
          updated_at: string | null
        }
        Insert: {
          base_exp: number
          created_at?: string
          exp_multiplier: number
          id?: number
          max_level: number
          public_id?: string
          updated_at?: string | null
        }
        Update: {
          base_exp?: number
          created_at?: string
          exp_multiplier?: number
          id?: number
          max_level?: number
          public_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      items_catalog: {
        Row: {
          attributes: Json | null
          category: string
          created_at: string
          description: string | null
          grade: string | null
          id: number
          image_url: string | null
          name: string
          next_evolution_id: number | null
          public_id: string
          sku: string | null
          sub_category: string
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          category: string
          created_at?: string
          description?: string | null
          grade?: string | null
          id?: number
          image_url?: string | null
          name: string
          next_evolution_id?: number | null
          public_id?: string
          sku?: string | null
          sub_category: string
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          category?: string
          created_at?: string
          description?: string | null
          grade?: string | null
          id?: number
          image_url?: string | null
          name?: string
          next_evolution_id?: number | null
          public_id?: string
          sku?: string | null
          sub_category?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_catalog_next_evolution_id_fkey"
            columns: ["next_evolution_id"]
            isOneToOne: true
            referencedRelation: "items_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          created_at: string
          id: number
          level: number
          required_exp: number
        }
        Insert: {
          created_at?: string
          id?: number
          level: number
          required_exp: number
        }
        Update: {
          created_at?: string
          id?: number
          level?: number
          required_exp?: number
        }
        Relationships: []
      }
      pomodoro_sessions: {
        Row: {
          completed_at: string | null
          config_duration: number
          created_at: string
          id: number
          public_id: string
          reward_blocks_earned: number
          started_at: string
          status: string
          task_id: number
          user_id: number
        }
        Insert: {
          completed_at?: string | null
          config_duration?: number
          created_at?: string
          id?: number
          public_id?: string
          reward_blocks_earned?: number
          started_at?: string
          status: string
          task_id: number
          user_id: number
        }
        Update: {
          completed_at?: string | null
          config_duration?: number
          created_at?: string
          id?: number
          public_id?: string
          reward_blocks_earned?: number
          started_at?: string
          status?: string
          task_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pomodoro_sessions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pomodoro_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accumulated_minutes: number
          avatar_url: string | null
          created_at: string
          exp: number
          id: number
          last_daily_claims: string | null
          level: number
          public_id: string
          time_essence: number
          unclaimed_exp: number
          unclaimed_time_essence: number
          updated_at: string | null
          username: string | null
        }
        Insert: {
          accumulated_minutes?: number
          avatar_url?: string | null
          created_at?: string
          exp?: number
          id?: number
          last_daily_claims?: string | null
          level?: number
          public_id?: string
          time_essence?: number
          unclaimed_exp?: number
          unclaimed_time_essence?: number
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          accumulated_minutes?: number
          avatar_url?: string | null
          created_at?: string
          exp?: number
          id?: number
          last_daily_claims?: string | null
          level?: number
          public_id?: string
          time_essence?: number
          unclaimed_exp?: number
          unclaimed_time_essence?: number
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          name: string
          public_id: string
          size: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          public_id?: string
          size?: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          public_id?: string
          size?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ranks: {
        Row: {
          attributes: Json | null
          badge_url: string | null
          created_at: string
          id: string
          min_level: number
          name: string
        }
        Insert: {
          attributes?: Json | null
          badge_url?: string | null
          created_at?: string
          id?: string
          min_level: number
          name: string
        }
        Update: {
          attributes?: Json | null
          badge_url?: string | null
          created_at?: string
          id?: string
          min_level?: number
          name?: string
        }
        Relationships: []
      }
      shop_offer_rewards: {
        Row: {
          category: string
          created_at: string
          customization_id: number | null
          duration_days: number | null
          id: string
          item_id: number | null
          offer_id: string
          quantity: number
        }
        Insert: {
          category: string
          created_at?: string
          customization_id?: number | null
          duration_days?: number | null
          id?: string
          item_id?: number | null
          offer_id?: string
          quantity?: number
        }
        Update: {
          category?: string
          created_at?: string
          customization_id?: number | null
          duration_days?: number | null
          id?: string
          item_id?: number | null
          offer_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_offer_rewards_customization_id_fkey"
            columns: ["customization_id"]
            isOneToOne: false
            referencedRelation: "customizations_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_offer_rewards_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_offers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          label: string | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active: boolean
          label?: string | null
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          current_pomodoro_session: number
          id: number
          is_completed: boolean
          project_id: number | null
          public_id: string
          tags: string[] | null
          target_pomodoro_sessions: number
          title: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          current_pomodoro_session?: number
          id?: number
          is_completed?: boolean
          project_id?: number | null
          public_id?: string
          tags?: string[] | null
          target_pomodoro_sessions?: number
          title: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          current_pomodoro_session?: number
          id?: number
          is_completed?: boolean
          project_id?: number | null
          public_id?: string
          tags?: string[] | null
          target_pomodoro_sessions?: number
          title?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_items: {
        Row: {
          created_at: string
          id: string
          item_id: number
          owner_id: number
          quantity: number
          trade_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: number
          owner_id: number
          quantity: number
          trade_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: number
          owner_id?: number
          quantity?: number
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_items_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          created_at: string
          id: string
          receiver_id: number
          sender_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: number
          sender_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: number
          sender_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trades_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_inventory: {
        Row: {
          acquired_at: string
          created_at: string
          current_exp: number | null
          current_level: number | null
          expired_at: string | null
          id: number
          instance_states: Json | null
          item_id: number
          quantity: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          acquired_at: string
          created_at?: string
          current_exp?: number | null
          current_level?: number | null
          expired_at?: string | null
          id?: number
          instance_states?: Json | null
          item_id: number
          quantity?: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          acquired_at?: string
          created_at?: string
          current_exp?: number | null
          current_level?: number | null
          expired_at?: string | null
          id?: number
          instance_states?: Json | null
          item_id?: number
          quantity?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          app_settings: Json | null
          created_at: string
          public_id: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          app_settings?: Json | null
          created_at?: string
          public_id: string
          updated_at?: string | null
          user_id?: number
        }
        Update: {
          app_settings?: Json | null
          created_at?: string
          public_id?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_unlocks: {
        Row: {
          created_at: string
          customization_id: number
          expires_at: string | null
          id: number
          public_id: string
          unlocked_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          customization_id: number
          expires_at?: string | null
          id?: number
          public_id?: string
          unlocked_at?: string
          user_id: number
        }
        Update: {
          created_at?: string
          customization_id?: number
          expires_at?: string | null
          id?: number
          public_id?: string
          unlocked_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_unlocks_customization_id_fkey"
            columns: ["customization_id"]
            isOneToOne: false
            referencedRelation: "customizations_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_unlocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
