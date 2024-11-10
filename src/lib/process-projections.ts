interface EnhancedProjection {
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

export const processEnhancedProjections = (data: any[]): EnhancedProjection[] => {
  return data.map(row => ({
    player_id: row['player_id'] || '',
    team: row['team'] || '',
    opp: row['opp'] || '',
    pos: row['pos'] || '',
    name: row['name'] || '',
    fpts: Number(row['fpts']) || 0,
    proj_own: Number(row['proj_own']) || 0,
    smash: Number(row['smash']) || 0,
    opto_pct: Number(row['opto_pct']) || 0,
    value_percent: Number(row['value_percent']) || 0,
    ceil: Number(row['ceil']) || 0,
    floor: Number(row['floor']) || 0,
    min_exposure: Number(row['min_exposure']) || 0,
    max_exposure: Number(row['max_exposure']) || 0,
    rg_value: Number(row['rg_value']) || 0,
    salary: Number(row['salary']) || 0,
    custom: row['custom'] || '',
    rg_id: row['rg_id'] || '',
    partner_id: row['partner_id'] || ''
  }));
};