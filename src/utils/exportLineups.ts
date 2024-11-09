const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  // Create header row
  const header = NBA_POSITIONS.join(',');
  
  // Transform lineups into DraftKings format
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    const slots = new Array(8).fill('');
    let remainingPlayers = [...players];

    // Helper function to find player for position
    const findPlayerForPosition = (position: string) => {
      const playerIndex = remainingPlayers.findIndex(lp => {
        const positions = lp.player?.roster_positions?.split(',') || [];
        return positions.includes(position);
      });

      if (playerIndex !== -1) {
        const player = remainingPlayers[playerIndex];
        remainingPlayers.splice(playerIndex, 1);
        return player;
      }
      return null;
    };

    // Fill primary positions (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const player = findPlayerForPosition(position);
      if (player?.player) {
        slots[index] = `${player.player.name} (${player.player.partner_id || ''})`;
      }
    });

    // Fill G slot (PG/SG)
    if (slots[5] === '') {
      const guardPlayer = remainingPlayers.find(lp => {
        const positions = lp.player?.roster_positions?.split(',') || [];
        return positions.includes('G');
      });
      
      if (guardPlayer?.player) {
        slots[5] = `${guardPlayer.player.name} (${guardPlayer.player.partner_id || ''})`;
        remainingPlayers = remainingPlayers.filter(p => p !== guardPlayer);
      }
    }

    // Fill F slot (SF/PF)
    if (slots[6] === '') {
      const forwardPlayer = remainingPlayers.find(lp => {
        const positions = lp.player?.roster_positions?.split(',') || [];
        return positions.includes('F');
      });
      
      if (forwardPlayer?.player) {
        slots[6] = `${forwardPlayer.player.name} (${forwardPlayer.player.partner_id || ''})`;
        remainingPlayers = remainingPlayers.filter(p => p !== forwardPlayer);
      }
    }

    // Fill UTIL with first remaining player
    if (slots[7] === '' && remainingPlayers.length > 0) {
      const utilPlayer = remainingPlayers[0];
      if (utilPlayer?.player) {
        slots[7] = `${utilPlayer.player.name} (${utilPlayer.player.partner_id || ''})`;
      }
    }

    // Fill any remaining empty slots with ()
    const filledSlots = slots.map(slot => slot || '()');
    
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