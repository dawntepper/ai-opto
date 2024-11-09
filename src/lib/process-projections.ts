interface Projection {
  player_id: string;
  team: string;
  opp: string;
  pos: string;
  name: string;
  fpts: number;
  proj_own: number;
  minutes: number;
  ceil: number;
  floor: number;
  rg_id: string;
  partner_id: string;
}

export const processProjections = (data: any[]): Projection[] => {
  return data.map(row => ({
    player_id: row['player_id'] || '',
    team: row['team'] || '',
    opp: row['opp'] || '',
    pos: row['pos'] || '',
    name: row['name'] || '',
    fpts: Number(row['fpts']) || 0,
    proj_own: Number(row['proj_own']) || 0,
    minutes: Number(row['minutes']) || 0,
    ceil: Number(row['ceil']) || 0,
    floor: Number(row['floor']) || 0,
    rg_id: row['rg_id'] || '',
    partner_id: row['partner_id'] || ''
  }));
};