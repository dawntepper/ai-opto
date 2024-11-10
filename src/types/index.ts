export type EntryType = 'single' | '3-max' | '20-max';
export type Sport = 'nba' | 'nfl' | 'mlb';

export interface Player {
  id: string;
  name: string;
  position: string;
  salary: number;
  team: string;
  opponent: string;
  projectedPoints: number;
  ownership: number;
  status: 'available' | 'questionable' | 'out';
  sport?: Sport;
  snapCount?: number;
  targetShare?: number;
  rushShare?: number;
}

export interface Lineup {
  id: string;
  players: Player[];
  totalSalary: number;
  projectedPoints: number;
  totalOwnership: number;
  sport?: Sport;
}

export interface OptimizationSettings {
  entryType: EntryType;
  maxSalary: number;
  maxOwnership: number;
  correlationStrength: 'weak' | 'medium' | 'strong';
  lineupCount: number;
  sport?: Sport;
}

export interface DefensiveMatchup {
  id: string;
  team: string;
  position: string;
  points_allowed_per_game: number;
  rank: number;
  season: string;
  week: number | null;
  last_updated?: string;
}