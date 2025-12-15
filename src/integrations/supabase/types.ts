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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      dictionary_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          player_name: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          player_name: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          player_name?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      game_players: {
        Row: {
          id: string
          is_host: boolean | null
          joined_at: string | null
          player_name: string
          room_id: string
        }
        Insert: {
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          player_name: string
          room_id: string
        }
        Update: {
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          player_name?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          categories: Json
          created_at: string | null
          current_letter: string | null
          current_round: number | null
          host_name: string
          id: string
          room_code: string
          round_started_at: string | null
          status: string
          timer_duration: number
          total_rounds: number | null
          updated_at: string | null
        }
        Insert: {
          categories: Json
          created_at?: string | null
          current_letter?: string | null
          current_round?: number | null
          host_name: string
          id?: string
          room_code: string
          round_started_at?: string | null
          status?: string
          timer_duration?: number
          total_rounds?: number | null
          updated_at?: string | null
        }
        Update: {
          categories?: Json
          created_at?: string | null
          current_letter?: string | null
          current_round?: number | null
          host_name?: string
          id?: string
          room_code?: string
          round_started_at?: string | null
          status?: string
          timer_duration?: number
          total_rounds?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      matchmaking_queue: {
        Row: {
          created_at: string
          id: string
          match_id: string | null
          matched_with: string | null
          player_name: string
          stake_amount: number
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id?: string | null
          matched_with?: string | null
          player_name: string
          stake_amount: number
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string | null
          matched_with?: string | null
          player_name?: string
          stake_amount?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "matchmaking_queue_matched_with_fkey"
            columns: ["matched_with"]
            isOneToOne: false
            referencedRelation: "matchmaking_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      online_match_answers: {
        Row: {
          answer: string | null
          category: string
          created_at: string
          id: string
          is_valid: boolean | null
          match_id: string
          player_name: string
          round_number: number
        }
        Insert: {
          answer?: string | null
          category: string
          created_at?: string
          id?: string
          is_valid?: boolean | null
          match_id: string
          player_name: string
          round_number: number
        }
        Update: {
          answer?: string | null
          category?: string
          created_at?: string
          id?: string
          is_valid?: boolean | null
          match_id?: string
          player_name?: string
          round_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "online_match_answers_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "online_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      online_matches: {
        Row: {
          categories: Json
          created_at: string
          current_letter: string | null
          current_round: number
          id: string
          player1_name: string
          player2_name: string
          round_started_at: string | null
          stake_amount: number
          status: string
          timer_duration: number
          total_rounds: number
          updated_at: string
          winner_name: string | null
        }
        Insert: {
          categories?: Json
          created_at?: string
          current_letter?: string | null
          current_round?: number
          id?: string
          player1_name: string
          player2_name: string
          round_started_at?: string | null
          stake_amount: number
          status?: string
          timer_duration?: number
          total_rounds?: number
          updated_at?: string
          winner_name?: string | null
        }
        Update: {
          categories?: Json
          created_at?: string
          current_letter?: string | null
          current_round?: number
          id?: string
          player1_name?: string
          player2_name?: string
          round_started_at?: string | null
          stake_amount?: number
          status?: string
          timer_duration?: number
          total_rounds?: number
          updated_at?: string
          winner_name?: string | null
        }
        Relationships: []
      }
      player_answers: {
        Row: {
          answer: string | null
          category: string
          created_at: string | null
          id: string
          player_id: string
          room_id: string
          round_number: number
        }
        Insert: {
          answer?: string | null
          category: string
          created_at?: string | null
          id?: string
          player_id: string
          room_id: string
          round_number: number
        }
        Update: {
          answer?: string | null
          category?: string
          created_at?: string | null
          id?: string
          player_id?: string
          room_id?: string
          round_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_answers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_answers_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          coins: number
          created_at: string
          id: string
          player_name: string
          total_losses: number
          total_wins: number
          updated_at: string
        }
        Insert: {
          coins?: number
          created_at?: string
          id?: string
          player_name: string
          total_losses?: number
          total_wins?: number
          updated_at?: string
        }
        Update: {
          coins?: number
          created_at?: string
          id?: string
          player_name?: string
          total_losses?: number
          total_wins?: number
          updated_at?: string
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
