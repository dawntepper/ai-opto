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

export interface EnhancedProjection {
  Name: string;
  Team: string;
  Projection: number;
  Salary: number;
  'Pts/$1k': number;
  FPPM: number;
  'USG%': number;
  Opp: string;
  DVP: number;
  Spread: number;
  Total: number;
  'O/U': number;
  Minutes: number;
  PTS: number;
  AST: number;
  REB: number;
  STL: number;
  BLK: number;
  FT: number;
  FGA: number;
  FGM: number;
  PER: number;
  'FG%': number;
  'eFG%': number;
}

export const transformDraftKingsData = (player: DraftKingsPlayer) => {
  const gameInfo = extractGameInfo(player.GameInfo);
  const opponent = gameInfo.awayTeam === player.TeamAbbrev ? gameInfo.homeTeam : gameInfo.awayTeam;
  
  return {
    name: player.Name,
    position: player.Position,
    salary: Number(player.Salary) || 0,
    team: player.TeamAbbrev,
    opponent: opponent,
    partner_id: player.ID,
    projected_points: Number(player.AvgPointsPerGame) || 0,
    ownership: 0,
    status: 'available',
    roster_positions: player.RosterPosition
  };
};

export const transformEnhancedProjections = (proj: EnhancedProjection, positionData?: { [key: string]: string }) => {
  return {
    name: proj.Name,
    position: positionData?.[proj.Name] || 'UNKNOWN',
    team: proj.Team,
    opponent: proj.Opp,
    projected_points: Number(proj.Projection) || 0,
    salary: Number(proj.Salary) || 0,
    fppm: Number(proj.FPPM) || 0,
    usage_rate: Number(proj['USG%']) || 0,
    dvp: Number(proj.DVP) || 0,
    spread: Number(proj.Spread) || 0,
    total: Number(proj.Total) || 0,
    over_under: Number(proj['O/U']) || 0,
    minutes: Number(proj.Minutes) || 0,
    points: Number(proj.PTS) || 0,
    assists: Number(proj.AST) || 0,
    rebounds: Number(proj.REB) || 0,
    steals: Number(proj.STL) || 0,
    blocks: Number(proj.BLK) || 0,
    free_throws: Number(proj.FT) || 0,
    field_goals_attempted: Number(proj.FGA) || 0,
    field_goals_made: Number(proj.FGM) || 0,
    player_efficiency: Number(proj.PER) || 0,
    field_goal_percentage: Number(proj['FG%']) || 0,
    effective_field_goal_percentage: Number(proj['eFG%']) || 0,
    status: 'available'
  };
};