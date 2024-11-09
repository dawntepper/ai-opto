const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  // Create header row
  const header = NBA_POSITIONS.join(',');
  
  // Transform lineups into DraftKings format
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    const validPlayers = players
      .filter((lp: any) => lp?.player) // Filter out null players
      .sort((a: any, b: any) => {
        // Sort players by their position index
        const posA = NBA_POSITIONS.indexOf(a.player.position);
        const posB = NBA_POSITIONS.indexOf(b.player.position);
        return posA - posB;
      });

    // Create an array of 8 slots (NBA_POSITIONS.length)
    const slots = new Array(8).fill('');
    
    // First, fill primary positions (PG, SG, SF, PF, C)
    validPlayers.forEach((lp: any) => {
      const player = lp.player;
      const positions = player.roster_positions?.split(',').map((p: string) => p.trim()) || [];
      const primaryPosition = positions[0];
      const positionIndex = NBA_POSITIONS.indexOf(primaryPosition);
      
      if (positionIndex !== -1 && slots[positionIndex] === '') {
        slots[positionIndex] = `${player.name} (${player.partner_id || ''})`;
      }
    });

    // Fill remaining slots (G, F, UTIL)
    validPlayers.forEach((lp: any) => {
      const player = lp.player;
      if (!slots.includes(`${player.name} (${player.partner_id || ''})`)) {
        const positions = player.roster_positions?.split(',').map((p: string) => p.trim()) || [];
        
        // Try to fill G slot (PG/SG)
        if (slots[5] === '' && (positions.includes('PG') || positions.includes('SG'))) {
          slots[5] = `${player.name} (${player.partner_id || ''})`;
        }
        // Try to fill F slot (SF/PF)
        else if (slots[6] === '' && (positions.includes('SF') || positions.includes('PF'))) {
          slots[6] = `${player.name} (${player.partner_id || ''})`;
        }
        // Fill UTIL slot
        else if (slots[7] === '') {
          slots[7] = `${player.name} (${player.partner_id || ''})`;
        }
      }
    });

    return slots.join(',');
  });

  // Combine header and lineups
  const content = [header, ...formattedLineups].join('\n');
  
  // Create and trigger download
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