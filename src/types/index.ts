export type EntryType = 'single' | '3-max' | '20-max';

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
}

export interface Lineup {
  id: string;
  players: Player[];
  totalSalary: number;
  projectedPoints: number;
  totalOwnership: number;
}

export interface OptimizationSettings {
  entryType: EntryType;
  maxSalary: number;
  minValue: number;
  maxOwnership: number;
  correlationStrength: 'weak' | 'medium' | 'strong';
}