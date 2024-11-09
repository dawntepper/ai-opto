const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

const mapPositionToRosterPositions = (position: string): string[] => {
  const positions = position.split('/');
  
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

  return [...new Set(rosterPositions)];
};

export const exportLineupsToDraftKings = (lineups: any[]) => {
  const header = NBA_POSITIONS.join(',');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Initial players:', players);
    
    const slots = new Array(8).fill(null);
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

    // Find and assign guard for G slot
    const guardPlayer = remainingPlayers.find(lp => {
      const pos = lp.player?.position || '';
      return pos.includes('PG') || pos.includes('SG');
    });

    if (guardPlayer) {
      slots[5] = `${guardPlayer.player.name} (${guardPlayer.player.partner_id || ''})`;
      remainingPlayers = remainingPlayers.filter(p => p !== guardPlayer);
    }

    // Find and assign forward for F slot
    const forwardPlayer = remainingPlayers.find(lp => {
      const pos = lp.player?.position || '';
      return pos.includes('SF') || pos.includes('PF');
    });

    if (forwardPlayer) {
      slots[6] = `${forwardPlayer.player.name} (${forwardPlayer.player.partner_id || ''})`;
      remainingPlayers = remainingPlayers.filter(p => p !== forwardPlayer);
    }

    // Fill UTIL with first remaining player
    if (remainingPlayers.length > 0) {
      const utilPlayer = remainingPlayers[0];
      slots[7] = `${utilPlayer.player.name} (${utilPlayer.player.partner_id || ''})`;
    }

    // Fill any remaining empty slots with "()"
    const filledSlots = slots.map(slot => slot || '()');
    console.log('Final lineup slots:', filledSlots);
    console.log('Remaining unassigned players:', remainingPlayers);
    
    return filledSlots.join(',');
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