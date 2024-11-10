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

export const transformEnhancedProjections = (proj: EnhancedProjection) => {
  // Get projected points from either fpts or rg_value, ensuring positive values
  const projectedPoints = Math.max(
    Number(proj.fpts) || 0,
    Number(proj.rg_value) || 0
  );

  // Ensure salary is a positive number
  const salary = Math.max(Number(proj.salary) || 0, 0);

  // Ensure ownership is a non-negative number
  const ownership = Math.max(Number(proj.proj_own) || 0, 0);

  return {
    name: proj.name,
    position: proj.pos,
    team: proj.team,
    opponent: proj.opp,
    projected_points: projectedPoints,
    salary: salary,
    ownership: ownership,
    status: 'available',
    roster_positions: mapPositionToRosterPositions(proj.pos),
    ceiling: Number(proj.ceil) || null,
    floor: Number(proj.floor) || null,
    partner_id: proj.partner_id,
    rg_id: proj.rg_id,
    sport: 'nfl'
  };
};