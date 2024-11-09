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
    console.log('Processing lineup:', lineup);
    const players = lineup.lineup_players || [];
    console.log('Initial players:', players);
    
    const slots = new Array(8).fill('');
    let remainingPlayers = [...players];

    // Helper function to find player for position
    const findPlayerForPosition = (position: string) => {
      console.log(`Looking for player for position: ${position}`);
      console.log('Current remaining players:', remainingPlayers);
      
      const playerIndex = remainingPlayers.findIndex(lp => {
        const rosterPositions = mapPositionToRosterPositions(lp.player?.position || '');
        console.log(`Checking player ${lp.player?.name} positions:`, rosterPositions);
        return rosterPositions.includes(position);
      });

      if (playerIndex !== -1) {
        const player = remainingPlayers[playerIndex];
        console.log(`Found player for ${position}:`, player.player?.name);
        remainingPlayers.splice(playerIndex, 1);
        return player;
      }
      console.log(`No player found for position ${position}`);
      return null;
    };

    // Fill primary positions (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const player = findPlayerForPosition(position);
      if (player?.player) {
        slots[index] = `${player.player.name} (${player.player.partner_id || ''})`;
        console.log(`Assigned ${player.player.name} to ${position}`);
      }
    });

    // Fill G slot (PG/SG)
    const guardPlayer = remainingPlayers.find(lp => {
      const pos = lp.player?.position || '';
      return pos.includes('PG') || pos.includes('SG');
    });
    
    if (guardPlayer?.player) {
      slots[5] = `${guardPlayer.player.name} (${guardPlayer.player.partner_id || ''})`;
      remainingPlayers = remainingPlayers.filter(p => p !== guardPlayer);
      console.log(`Assigned ${guardPlayer.player.name} to G slot`);
    }

    // Fill F slot (SF/PF)
    const forwardPlayer = remainingPlayers.find(lp => {
      const pos = lp.player?.position || '';
      return pos.includes('SF') || pos.includes('PF');
    });
    
    if (forwardPlayer?.player) {
      slots[6] = `${forwardPlayer.player.name} (${forwardPlayer.player.partner_id || ''})`;
      remainingPlayers = remainingPlayers.filter(p => p !== forwardPlayer);
      console.log(`Assigned ${forwardPlayer.player.name} to F slot`);
    }

    // Fill UTIL with first remaining player
    if (slots[7] === '' && remainingPlayers.length > 0) {
      const utilPlayer = remainingPlayers[0];
      if (utilPlayer?.player) {
        slots[7] = `${utilPlayer.player.name} (${utilPlayer.player.partner_id || ''})`;
        console.log(`Assigned ${utilPlayer.player.name} to UTIL slot`);
      }
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