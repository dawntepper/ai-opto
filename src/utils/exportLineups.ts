const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    const usedInFlexPositions = new Set();
    const positionAssignments = new Map();

    // Helper function to check if a player is eligible for a position
    const isEligibleForPosition = (player: any, pos: string) => {
      if (!player?.player?.position) return false;
      const positions = player.player.position.split('/');
      switch (pos) {
        case 'PG': return positions.includes('PG');
        case 'SG': return positions.includes('SG');
        case 'SF': return positions.includes('SF');
        case 'PF': return positions.includes('PF');
        case 'C': return positions.includes('C');
        case 'G': return positions.some(p => p === 'PG' || p === 'SG');
        case 'F': return positions.some(p => p === 'SF' || p === 'PF');
        case 'UTIL': return true;
        default: return false;
      }
    };

    // Helper function to format player string
    const formatPlayer = (player: any) => {
      positionAssignments.set(player.player.id, player.player.position);
      return `${player.player.name} (${player.player.partner_id || ''})`;
    };

    // Helper function to find an unused player for a position
    const findPlayerForPosition = (pos: string, usedIds = new Set()) => {
      return players.find(p => 
        !usedIds.has(p.player.id) && isEligibleForPosition(p, pos)
      );
    };

    // Keep track of used players in primary positions
    const usedInPrimary = new Set();

    // Fill PG position
    const pgPlayer = findPlayerForPosition('PG', usedInPrimary);
    if (pgPlayer) {
      slots[0] = formatPlayer(pgPlayer);
      usedInPrimary.add(pgPlayer.player.id);
    }

    // Fill SG position
    const sgPlayer = findPlayerForPosition('SG', usedInPrimary);
    if (sgPlayer) {
      slots[1] = formatPlayer(sgPlayer);
      usedInPrimary.add(sgPlayer.player.id);
    }

    // Fill SF position
    const sfPlayer = findPlayerForPosition('SF', usedInPrimary);
    if (sfPlayer) {
      slots[2] = formatPlayer(sfPlayer);
      usedInPrimary.add(sfPlayer.player.id);
    }

    // Fill PF position
    const pfPlayer = findPlayerForPosition('PF', usedInPrimary);
    if (pfPlayer) {
      slots[3] = formatPlayer(pfPlayer);
      usedInPrimary.add(pfPlayer.player.id);
    }

    // Fill C position
    const cPlayer = findPlayerForPosition('C', usedInPrimary);
    if (cPlayer) {
      slots[4] = formatPlayer(cPlayer);
      usedInPrimary.add(cPlayer.player.id);
    }

    // Fill G slot (can use PG or SG)
    const guardPlayer = players.find(p => 
      !usedInFlexPositions.has(p.player.id) && isEligibleForPosition(p, 'G')
    );
    if (guardPlayer) {
      slots[5] = formatPlayer(guardPlayer);
      usedInFlexPositions.add(guardPlayer.player.id);
    }

    // Fill F slot (can use SF or PF)
    const forwardPlayer = players.find(p => 
      !usedInFlexPositions.has(p.player.id) && isEligibleForPosition(p, 'F')
    );
    if (forwardPlayer) {
      slots[6] = formatPlayer(forwardPlayer);
      usedInFlexPositions.add(forwardPlayer.player.id);
    }

    // Fill UTIL with any remaining player
    const utilPlayer = players.find(p => 
      !usedInPrimary.has(p.player.id) && 
      !usedInFlexPositions.has(p.player.id)
    );
    if (utilPlayer) {
      slots[7] = formatPlayer(utilPlayer);
    }

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
