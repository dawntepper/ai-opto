import { Tables, TablesInsert, TablesUpdate } from './tables';
import { Enums } from './enums';

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
      file_uploads: Tables<'file_uploads'>
      lineup_players: Tables<'lineup_players'>
      lineups: Tables<'lineups'>
      optimization_settings: Tables<'optimization_settings'>
      players: Tables<'players'>
      slate_analysis: Tables<'slate_analysis'>
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