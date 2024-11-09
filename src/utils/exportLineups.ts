const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  // Create header row
  const header = NBA_POSITIONS.join(',');
  
  // Transform lineups into DraftKings format
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    
    // Initialize slots array with empty strings
    const slots = new Array(8).fill('');
    
    // First pass: Fill primary positions (PG, SG, SF, PF, C)
    players.forEach((lp: any) => {
      const player = lp.player;
      if (!player) return;
      
      const playerString = `${player.name} (${player.partner_id || ''})`;
      const position = player.position;
      
      // Try to fill primary position first
      const primaryIndex = NBA_POSITIONS.indexOf(position);
      if (primaryIndex !== -1 && primaryIndex < 5 && slots[primaryIndex] === '') {
        slots[primaryIndex] = playerString;
        return;
      }
    });

    // Second pass: Fill G slot (PG/SG)
    if (slots[5] === '') {
      const guardPlayer = players.find((lp: any) => {
        const pos = lp.player?.position;
        return (pos === 'PG' || pos === 'SG') && 
          !slots.includes(`${lp.player.name} (${lp.player.partner_id || ''})`);
      });
      if (guardPlayer) {
        slots[5] = `${guardPlayer.player.name} (${guardPlayer.player.partner_id || ''})`;
      }
    }

    // Third pass: Fill F slot (SF/PF)
    if (slots[6] === '') {
      const forwardPlayer = players.find((lp: any) => {
        const pos = lp.player?.position;
        return (pos === 'SF' || pos === 'PF') && 
          !slots.includes(`${lp.player.name} (${lp.player.partner_id || ''})`);
      });
      if (forwardPlayer) {
        slots[6] = `${forwardPlayer.player.name} (${forwardPlayer.player.partner_id || ''})`;
      }
    }

    // Final pass: Fill UTIL with any remaining player
    if (slots[7] === '') {
      const remainingPlayer = players.find((lp: any) => {
        if (!lp.player) return false;
        return !slots.includes(`${lp.player.name} (${lp.player.partner_id || ''})`);
      });
      if (remainingPlayer) {
        slots[7] = `${remainingPlayer.player.name} (${remainingPlayer.player.partner_id || ''})`;
      }
    }

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