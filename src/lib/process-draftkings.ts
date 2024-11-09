interface DKPlayer {
  Position: string;
  Name: string;
  ID: string;
  RosterPosition: string;
  Salary: number;
  GameInfo: string;
  TeamAbbrev: string;
  AvgPointsPerGame: number;
}

export const processDraftKingsTemplate = (data: any[]): DKPlayer[] => {
  return data.map(row => ({
    Position: row['Position'] || '',
    Name: row['Name'] || '',
    ID: row['ID'] || '',
    RosterPosition: row['Roster Position'] || '',
    Salary: Number(row['Salary']) || 0,
    GameInfo: row['Game Info'] || '',
    TeamAbbrev: row['TeamAbbrev'] || '',
    AvgPointsPerGame: Number(row['AvgPointsPerGame']) || 0
  }));
};

export const extractGameInfo = (gameInfo: string) => {
  const [teams, dateTime] = gameInfo.split(' ');
  const [away, home] = teams.split('@');
  return {
    homeTeam: home,
    awayTeam: away,
    gameTime: dateTime
  };
};