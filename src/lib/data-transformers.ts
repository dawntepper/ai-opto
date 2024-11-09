import { extractGameInfo } from './process-draftkings';

export interface DraftKingsPlayer {
  ID: string;
  Name: string;
  Position: string;
  Salary: number;
  TeamAbbrev: string;
  GameInfo: string;
  AvgPointsPerGame: number;
  RosterPosition: string;
}

export interface Projection {
  partner_id: string;
  fpts: number;
  proj_own: number;
  ceil: number;
  floor: number;
  minutes: number;
  rg_id: string;
}

export const transformDraftKingsData = (player: DraftKingsPlayer) => ({
  name: player.Name,
  position: player.Position,
  salary: Number(player.Salary),
  team: player.TeamAbbrev,
  opponent: extractGameInfo(player.GameInfo).awayTeam,
  partner_id: player.ID,
  projected_points: Number(player.AvgPointsPerGame) || 0,
  ownership: 0,
  status: 'available',
  roster_positions: player.RosterPosition
});

export const transformProjectionsData = (proj: Projection) => ({
  partner_id: proj.partner_id,
  projected_points: Number(proj.fpts) || 0,
  ownership: Number(proj.proj_own) || 0,
  ceiling: Number(proj.ceil) || null,
  floor: Number(proj.floor) || null,
  minutes: Number(proj.minutes) || null,
  rg_id: proj.rg_id || null,
  status: 'available'
});