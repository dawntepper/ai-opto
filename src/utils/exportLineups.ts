const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  // Create header row
  const header = NBA_POSITIONS.join(',');
  
  // Transform lineups into DraftKings format
  const formattedLineups = lineups.map(lineup => {
    // Get all players from the lineup
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', players);
    
    // Initialize slots array with empty strings
    const slots = new Array(8).fill('');
    
    // Create a copy of players that we can modify as we assign positions
    let remainingPlayers = [...players];
    
    // First pass: Fill primary positions (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const playerForPosition = remainingPlayers.find(lp => 
        lp.player?.roster_positions?.includes(position)
      );
      if (playerForPosition?.player) {
        slots[index] = `${playerForPosition.player.name} (${playerForPosition.player.partner_id || ''})`;
        remainingPlayers = remainingPlayers.filter(p => p !== playerForPosition);
      }
    });

    // Second pass: Fill G slot (PG/SG)
    if (slots[5] === '') {
      const guardPlayer = remainingPlayers.find(lp => 
        lp.player?.roster_positions?.some(pos => ['PG', 'SG'].includes(pos))
      );
      if (guardPlayer?.player) {
        slots[5] = `${guardPlayer.player.name} (${guardPlayer.player.partner_id || ''})`;
        remainingPlayers = remainingPlayers.filter(p => p !== guardPlayer);
      }
    }

    // Third pass: Fill F slot (SF/PF)
    if (slots[6] === '') {
      const forwardPlayer = remainingPlayers.find(lp => 
        lp.player?.roster_positions?.some(pos => ['SF', 'PF'].includes(pos))
      );
      if (forwardPlayer?.player) {
        slots[6] = `${forwardPlayer.player.name} (${forwardPlayer.player.partner_id || ''})`;
        remainingPlayers = remainingPlayers.filter(p => p !== forwardPlayer);
      }
    }

    // Final pass: Fill UTIL with remaining players
    if (slots[7] === '' && remainingPlayers.length > 0) {
      const utilPlayer = remainingPlayers[0];
      if (utilPlayer?.player) {
        slots[7] = `${utilPlayer.player.name} (${utilPlayer.player.partner_id || ''})`;
        remainingPlayers = remainingPlayers.filter(p => p !== utilPlayer);
      }
    }

    // Fill any remaining empty slots with ()
    const filledSlots = slots.map(slot => slot || '()');
    console.log('Final slots:', filledSlots);
    
    return filledSlots.join(',');
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