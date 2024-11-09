interface EnhancedProjection {
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

export const processEnhancedProjections = (data: any[]): EnhancedProjection[] => {
  return data.map(row => ({
    Name: row['Name'] || '',
    Team: row['Team'] || '',
    Projection: Number(row['Projection']) || 0,
    Salary: Number(row['Salary']) || 0,
    'Pts/$1k': Number(row['Pts/$1k']) || 0,
    FPPM: Number(row['FPPM']) || 0,
    'USG%': Number(row['USG%']) || 0,
    Opp: row['Opp'] || '',
    DVP: Number(row['DVP']) || 0,
    Spread: Number(row['Spread']) || 0,
    Total: Number(row['Total']) || 0,
    'O/U': Number(row['O/U']) || 0,
    Minutes: Number(row['Minutes']) || 0,
    PTS: Number(row['PTS']) || 0,
    AST: Number(row['AST']) || 0,
    REB: Number(row['REB']) || 0,
    STL: Number(row['STL']) || 0,
    BLK: Number(row['BLK']) || 0,
    FT: Number(row['FT']) || 0,
    FGA: Number(row['FGA']) || 0,
    FGM: Number(row['FGM']) || 0,
    PER: Number(row['PER']) || 0,
    'FG%': Number(row['FG%']) || 0,
    'eFG%': Number(row['eFG%']) || 0
  }));
};