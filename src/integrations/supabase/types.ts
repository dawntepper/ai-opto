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
      file_uploads: {
        Row: {
          content: string | null
          created_at: string | null
          file_type: string
          filename: string
          id: string
          processed: boolean | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_type: string
          filename: string
          id?: string
          processed?: boolean | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_type?: string
          filename?: string
          id?: string
          processed?: boolean | null
        }
        Relationships: []
      }
      lineup_players: {
        Row: {
          lineup_id: string
          player_id: string
        }
        Insert: {
          lineup_id: string
          player_id: string
        }
        Update: {
          lineup_id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lineup_players_lineup_id_fkey"
            columns: ["lineup_id"]
            isOneToOne: false
            referencedRelation: "lineups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lineup_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      lineups: {
        Row: {
          created_at: string | null
          id: string
          projected_points: number
          sport: string | null
          total_ownership: number
          total_salary: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          projected_points: number
          sport?: string | null
          total_ownership: number
          total_salary: number
        }
        Update: {
          created_at?: string | null
          id?: string
          projected_points?: number
          sport?: string | null
          total_ownership?: number
          total_salary?: number
        }
        Relationships: []
      }
      optimization_settings: {
        Row: {
          correlation_strength: string
          created_at: string | null
          entry_type: string
          id: string
          lineup_count: number
          max_ownership: number
          max_salary: number
          min_value: number
          sport: string | null
        }
        Insert: {
          correlation_strength: string
          created_at?: string | null
          entry_type: string
          id?: string
          lineup_count: number
          max_ownership: number
          max_salary: number
          min_value: number
          sport?: string | null
        }
        Update: {
          correlation_strength?: string
          created_at?: string | null
          entry_type?: string
          id?: string
          lineup_count?: number
          max_ownership?: number
          max_salary?: number
          min_value?: number
          sport?: string | null
        }
        Relationships: []
      }
      player_adjustments: {
        Row: {
          created_at: string | null
          id: string
          ownership_multiplier: number
          player_id: string
          projection_multiplier: number
          reason: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ownership_multiplier: number
          player_id: string
          projection_multiplier: number
          reason: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ownership_multiplier?: number
          player_id?: string
          projection_multiplier?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_adjustments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          assists: number | null
          blocks: number | null
          ceiling: number | null
          created_at: string | null
          defense_rank: number | null
          dvp: number | null
          effective_field_goal_percentage: number | null
          field_goal_percentage: number | null
          field_goals_attempted: number | null
          field_goals_made: number | null
          floor: number | null
          fppm: number | null
          free_throws: number | null
          game_time: string | null
          id: string
          minutes: number | null
          name: string
          opponent: string
          over_under: number | null
          ownership: number
          partner_id: string | null
          player_efficiency: number | null
          points: number | null
          position: string
          position_flex: string[] | null
          proj_ownership: number | null
          projected_points: number
          rebounds: number | null
          red_zone_share: number | null
          rg_id: string | null
          roster_positions: string | null
          rush_share: number | null
          salary: number
          snap_count: number | null
          sport: string | null
          spread: number | null
          status: string
          steals: number | null
          target_share: number | null
          team: string
          total: number | null
          usage_rate: number | null
          weather_conditions: string | null
        }
        Insert: {
          assists?: number | null
          blocks?: number | null
          ceiling?: number | null
          created_at?: string | null
          defense_rank?: number | null
          dvp?: number | null
          effective_field_goal_percentage?: number | null
          field_goal_percentage?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          floor?: number | null
          fppm?: number | null
          free_throws?: number | null
          game_time?: string | null
          id?: string
          minutes?: number | null
          name: string
          opponent: string
          over_under?: number | null
          ownership: number
          partner_id?: string | null
          player_efficiency?: number | null
          points?: number | null
          position: string
          position_flex?: string[] | null
          proj_ownership?: number | null
          projected_points: number
          rebounds?: number | null
          red_zone_share?: number | null
          rg_id?: string | null
          roster_positions?: string | null
          rush_share?: number | null
          salary: number
          snap_count?: number | null
          sport?: string | null
          spread?: number | null
          status: string
          steals?: number | null
          target_share?: number | null
          team: string
          total?: number | null
          usage_rate?: number | null
          weather_conditions?: string | null
        }
        Update: {
          assists?: number | null
          blocks?: number | null
          ceiling?: number | null
          created_at?: string | null
          defense_rank?: number | null
          dvp?: number | null
          effective_field_goal_percentage?: number | null
          field_goal_percentage?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          floor?: number | null
          fppm?: number | null
          free_throws?: number | null
          game_time?: string | null
          id?: string
          minutes?: number | null
          name?: string
          opponent?: string
          over_under?: number | null
          ownership?: number
          partner_id?: string | null
          player_efficiency?: number | null
          points?: number | null
          position?: string
          position_flex?: string[] | null
          proj_ownership?: number | null
          projected_points?: number
          rebounds?: number | null
          red_zone_share?: number | null
          rg_id?: string | null
          roster_positions?: string | null
          rush_share?: number | null
          salary?: number
          snap_count?: number | null
          sport?: string | null
          spread?: number | null
          status?: string
          steals?: number | null
          target_share?: number | null
          team?: string
          total?: number | null
          usage_rate?: number | null
          weather_conditions?: string | null
        }
        Relationships: []
      }
      position_correlations: {
        Row: {
          correlation_strength: number
          created_at: string | null
          id: string
          position1: string
          position2: string
          sport: string
        }
        Insert: {
          correlation_strength: number
          created_at?: string | null
          id?: string
          position1: string
          position2: string
          sport: string
        }
        Update: {
          correlation_strength?: number
          created_at?: string | null
          id?: string
          position1?: string
          position2?: string
          sport?: string
        }
        Relationships: []
      }
      slate_analysis: {
        Row: {
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_optimal_lineups: {
        Args: {
          settings_id: string
        }
        Returns: {
          lineup_id: string
          total_salary: number
          projected_points: number
          total_ownership: number
        }[]
      }
      multiply_ownership: {
        Args: {
          player_id: string
          multiplier: number
        }
        Returns: number
      }
      multiply_points: {
        Args: {
          player_id: string
          multiplier: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
