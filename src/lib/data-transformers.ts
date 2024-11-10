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
  player_id: string;
  team: string;
  opp: string;
  pos: string;
  name: string;
  fpts: number;
  proj_own: number;
  smash: number;
  opto_pct: number;
  value_percent: number;
  ceil: number;
  floor: number;
  min_exposure: number;
  max_exposure: number;
  rg_value: number;
  salary: number;
  custom: string;
  rg_id: string;
  partner_id: string;
}

const mapPositionToRosterPositions = (position: string): string => {
  const positions = position.split('/');
  
  const rosterPositions = positions.map(pos => {
    switch (pos.trim()) {
      case 'QB':
        return ['QB'];
      case 'RB':
        return ['RB', 'FLEX'];
      case 'WR':
        return ['WR', 'FLEX'];
      case 'TE':
        return ['TE', 'FLEX'];
      case 'DST':
        return ['DST'];
      default:
        return ['FLEX'];
    }
  });

  return [...new Set(rosterPositions.flat())].join(',');
};

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
    roster_positions: mapPositionToRosterPositions(player.Position),
    sport: 'nfl'
  };
};

const safeNumber = (value: any): number => {
  // Convert to number and handle various cases
  const num = Number(value);
  // Return 0 for null, undefined, NaN, empty string, or negative values
  return (!value || isNaN(num) || num < 0) ? 0 : num;
};

export const transformEnhancedProjections = (proj: EnhancedProjection) => {
  // Get projected points from either fpts or rg_value, ensuring positive values
  // If both are negative or zero, default to 0
  const projectedPoints = Math.max(
    safeNumber(proj.fpts),
    Math.abs(safeNumber(proj.rg_value)) // Convert negative RG values to positive
  );

  // Ensure salary is a positive number
  const salary = safeNumber(proj.salary);

  // Ensure ownership is a non-negative number
  const ownership = safeNumber(proj.proj_own);

  // Convert negative RG ID to positive string if needed
  const rgId = proj.rg_id?.startsWith('-') ? proj.rg_id.substring(1) : proj.rg_id;

  return {
    name: proj.name || '',
    position: proj.pos || '',
    team: proj.team || '',
    opponent: proj.opp || '',
    projected_points: projectedPoints,
    salary: salary,
    ownership: ownership,
    proj_ownership: ownership, // Store in both fields for consistency
    status: 'available',
    roster_positions: mapPositionToRosterPositions(proj.pos || ''),
    ceiling: safeNumber(proj.ceil),
    floor: safeNumber(proj.floor),
    partner_id: proj.partner_id || null,
    rg_id: rgId || null,
    sport: 'nfl'
  };
};