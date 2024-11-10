const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    const assignedPositions = new Map(); // Track where each player is assigned
    const usedInFlexPositions = new Set(); // Track players used in G/F/UTIL

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
      return `${player.player.name} (${player.player.partner_id || ''})`;
    };

    // Fill primary positions first (PG, SG, SF, PF, C)
    ['PG', 'SG', 'SF', 'PF', 'C'].forEach((pos, index) => {
      const playerIndex = players.findIndex(p => 
        !assignedPositions.has(p.player.id) && isEligibleForPosition(p, pos)
      );

      if (playerIndex !== -1) {
        const player = players[playerIndex];
        slots[index] = formatPlayer(player);
        assignedPositions.set(player.player.id, pos);
      }
    });

    // Find an eligible guard for G slot who hasn't been used in flex positions
    const guardsForGSlot = players.filter(p => 
      isEligibleForPosition(p, 'G') && !usedInFlexPositions.has(p.player.id)
    );
    
    if (guardsForGSlot.length > 0) {
      const guardPlayer = guardsForGSlot[0];
      slots[5] = formatPlayer(guardPlayer);
      usedInFlexPositions.add(guardPlayer.player.id);
    }

    // Find an eligible forward for F slot who hasn't been used in flex positions
    const forwardsForFSlot = players.filter(p => 
      isEligibleForPosition(p, 'F') && !usedInFlexPositions.has(p.player.id)
    );
    
    if (forwardsForFSlot.length > 0) {
      const forwardPlayer = forwardsForFSlot[0];
      slots[6] = formatPlayer(forwardPlayer);
      usedInFlexPositions.add(forwardPlayer.player.id);
    }

    // Find a player for UTIL who hasn't been used in flex positions
    const remainingPlayers = players.filter(p => !usedInFlexPositions.has(p.player.id));
    
    if (remainingPlayers.length > 0) {
      slots[7] = formatPlayer(remainingPlayers[0]);
    }

    console.log('Final lineup slots:', slots);
    console.log('Position assignments:', Object.fromEntries(assignedPositions));
    console.log('Used in flex positions:', [...usedInFlexPositions]);
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