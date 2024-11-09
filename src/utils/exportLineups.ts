const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  // Create header row
  const header = NBA_POSITIONS.join(',');
  
  // Transform lineups into DraftKings format
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    
    // Initialize slots array with empty strings
    const slots = new Array(8).fill('');
    
    // Create a copy of players that we can modify as we assign positions
    let remainingPlayers = [...players];
    
    // First pass: Fill primary positions (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const playerForPosition = remainingPlayers.find(lp => 
        lp.player?.position === position && lp.player?.partner_id
      );
      if (playerForPosition?.player) {
        slots[index] = `${playerForPosition.player.name} (${playerForPosition.player.partner_id})`;
        remainingPlayers = remainingPlayers.filter(p => p !== playerForPosition);
      }
    });

    // Second pass: Fill G slot (PG/SG)
    if (slots[5] === '') {
      const guardPlayer = remainingPlayers.find(lp => 
        (lp.player?.position === 'PG' || lp.player?.position === 'SG') && 
        lp.player?.partner_id
      );
      if (guardPlayer?.player) {
        slots[5] = `${guardPlayer.player.name} (${guardPlayer.player.partner_id})`;
        remainingPlayers = remainingPlayers.filter(p => p !== guardPlayer);
      }
    }

    // Third pass: Fill F slot (SF/PF)
    if (slots[6] === '') {
      const forwardPlayer = remainingPlayers.find(lp => 
        (lp.player?.position === 'SF' || lp.player?.position === 'PF') && 
        lp.player?.partner_id
      );
      if (forwardPlayer?.player) {
        slots[6] = `${forwardPlayer.player.name} (${forwardPlayer.player.partner_id})`;
        remainingPlayers = remainingPlayers.filter(p => p !== forwardPlayer);
      }
    }

    // Final pass: Fill UTIL with first remaining player
    if (slots[7] === '' && remainingPlayers.length > 0) {
      const utilPlayer = remainingPlayers[0];
      if (utilPlayer?.player) {
        slots[7] = `${utilPlayer.player.name} (${utilPlayer.player.partner_id})`;
      }
    }

    // Double check all players are assigned and fill empty slots
    remainingPlayers.forEach(player => {
      if (!player?.player) return;
      
      // Find first empty slot after primary positions
      for (let i = 5; i < slots.length; i++) {
        if (slots[i] === '') {
          slots[i] = `${player.player.name} (${player.player.partner_id})`;
          break;
        }
      }
    });

    // Ensure all slots are filled with at least empty parentheses
    return slots.map(slot => slot || '()').join(',');
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