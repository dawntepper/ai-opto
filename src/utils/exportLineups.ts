const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];
const NFL_POSITIONS = ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'DST'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  // Get the sport from the first lineup
  const sport = lineups[0]?.sport || 'nba';
  const positions = sport === 'nfl' ? NFL_POSITIONS : NBA_POSITIONS;
  
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = positions.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    // Get the players' names and IDs in the exact order they appear in the lineup
    const slots = positions.map((_, index) => {
      const player = players[index]?.player;
      return player ? `${player.name} (${player.partner_id || ''})` : '()';
    });

    console.log('Final lineup slots:', slots);
    return slots.join('\t');
  });

  const content = [header, ...formattedLineups].join('\n');
  
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `draftkings_${sport}_lineups_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};