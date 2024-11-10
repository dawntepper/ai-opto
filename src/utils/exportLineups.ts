const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    // Create array to store players in their correct positions
    const slots = new Array(8).fill('()');
    
    // Format player for CSV
    const formatPlayer = (player: any) => {
      return `${player.player.name} (${player.player.partner_id || ''})`;
    };

    // Process each player in the lineup
    players.forEach(playerData => {
      const player = playerData.player;
      if (!player || !player.position) return;

      // Get all positions this player can play
      const positions = player.roster_positions ? 
        player.roster_positions.split(',') : 
        player.position.split('/');

      // Find the first available slot for this player
      for (let i = 0; i < NBA_POSITIONS.length; i++) {
        const pos = NBA_POSITIONS[i];
        if (slots[i] === '()' && positions.includes(pos)) {
          slots[i] = formatPlayer(playerData);
          break;
        }
      }
    });

    console.log('Final lineup slots:', slots);
    return slots.join('\t');
  });

  const content = [header, ...formattedLineups].join('\n');
  
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `draftkings_nba_lineups_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};