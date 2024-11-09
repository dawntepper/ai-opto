const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

const mapPositionToRosterPositions = (position: string): string[] => {
  // Handle multi-position players (e.g., "PG/SG")
  const positions = position.split('/');
  
  // Map each position to its eligible roster spots
  const rosterPositions = positions.flatMap(pos => {
    switch (pos.trim()) {
      case 'PG':
        return ['PG', 'G', 'UTIL'];
      case 'SG':
        return ['SG', 'G', 'UTIL'];
      case 'SF':
        return ['SF', 'F', 'UTIL'];
      case 'PF':
        return ['PF', 'F', 'UTIL'];
      case 'C':
        return ['C', 'UTIL'];
      default:
        return ['UTIL'];
    }
  });

  // Deduplicate the array
  return [...new Set(rosterPositions)];
};

export const exportLineupsToDraftKings = (lineups: any[]) => {
  // Create header row
  const header = NBA_POSITIONS.join(',');
  
  // Transform lineups into DraftKings format
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Initial players:', players);
    
    const slots = new Array(8).fill('');
    let remainingPlayers = [...players];

    // Helper function to find player for position
    const findPlayerForPosition = (position: string) => {
      const playerIndex = remainingPlayers.findIndex(lp => {
        const rosterPositions = mapPositionToRosterPositions(lp.player?.position || '');
        return rosterPositions.includes(position);
      });

      if (playerIndex !== -1) {
        const player = remainingPlayers[playerIndex];
        remainingPlayers.splice(playerIndex, 1);
        return player;
      }
      return null;
    };

    // Fill primary positions first (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const player = findPlayerForPosition(position);
      if (player?.player) {
        slots[index] = `${player.player.name} (${player.player.partner_id || ''})`;
      }
    });

    // Store players that could be guards or forwards before filling UTIL
    const potentialGuards = remainingPlayers.filter(lp => {
      const pos = lp.player?.position || '';
      return pos.includes('PG') || pos.includes('SG');
    });

    const potentialForwards = remainingPlayers.filter(lp => {
      const pos = lp.player?.position || '';
      return pos.includes('SF') || pos.includes('PF');
    });

    // Fill G slot (PG/SG)
    if (potentialGuards.length > 0) {
      const guardPlayer = potentialGuards[0];
      slots[5] = `${guardPlayer.player.name} (${guardPlayer.player.partner_id || ''})`;
      remainingPlayers = remainingPlayers.filter(p => p !== guardPlayer);
    }

    // Fill F slot (SF/PF)
    if (potentialForwards.length > 0) {
      const forwardPlayer = potentialForwards[0];
      slots[6] = `${forwardPlayer.player.name} (${forwardPlayer.player.partner_id || ''})`;
      remainingPlayers = remainingPlayers.filter(p => p !== forwardPlayer);
    }

    // Fill UTIL with first remaining player
    if (remainingPlayers.length > 0) {
      const utilPlayer = remainingPlayers[0];
      slots[7] = `${utilPlayer.player.name} (${utilPlayer.player.partner_id || ''})`;
    }

    // Fill any remaining empty slots with ()
    const filledSlots = slots.map(slot => slot || '()');
    console.log('Final lineup slots:', filledSlots);
    console.log('Remaining unassigned players:', remainingPlayers);
    
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