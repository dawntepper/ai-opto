export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

type Database = {
  public: {
    Tables: {
      file_uploads: {
        Row: {
          created_at: string | null
          file_type: string
          filename: string
          id: string
          processed: boolean | null
          content: string | null
        }
        Insert: {
          created_at?: string | null
          file_type: string
          filename: string
          id?: string
          processed?: boolean | null
          content?: string | null
        }
        Update: {
          created_at?: string | null
          file_type?: string
          filename?: string
          id?: string
          processed?: boolean | null
          content?: string | null
        }
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
          total_ownership: number
          total_salary: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          projected_points: number
          total_ownership: number
          total_salary: number
        }
        Update: {
          created_at?: string | null
          id?: string
          projected_points?: number
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
        }
        Relationships: []
      }
      players: {
        Row: {
          ceiling: number | null
          created_at: string | null
          floor: number | null
          id: string
          minutes: number | null
          name: string
          opponent: string
          ownership: number
          partner_id: string | null
          position: string
          proj_ownership: number | null
          projected_points: number
          rg_id: string | null
          roster_positions: string | null
          salary: number
          status: string
          team: string
        }
        Insert: {
          ceiling?: number | null
          created_at?: string | null
          floor?: number | null
          id: string
          minutes?: number | null
          name: string
          opponent: string
          ownership: number
          partner_id?: string | null
          position: string
          proj_ownership?: number | null
          projected_points: number
          rg_id?: string | null
          roster_positions?: string | null
          salary: number
          status: string
          team: string
        }
        Update: {
          ceiling?: number | null
          created_at?: string | null
          floor?: number | null
          id?: string
          minutes?: number | null
          name?: string
          opponent?: string
          ownership?: number
          partner_id?: string | null
          position?: string
          proj_ownership?: number | null
          projected_points?: number
          rg_id?: string | null
          roster_positions?: string | null
          salary?: number
          status?: string
          team?: string
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
