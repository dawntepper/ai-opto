const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    let remainingPlayers = [...players];
    const primarySlots = new Map(); // Track players in primary slots
    const flexUsedPlayerIds = new Set(); // Track players used in flex positions

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

    // Helper function to mark a player as used in a flex position
    const markPlayerAsUsedInFlex = (player: any) => {
      flexUsedPlayerIds.add(player.player.id);
    };

    // Fill primary positions first (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const playerIndex = remainingPlayers.findIndex(p => 
        !primarySlots.has(p.player.id) && isEligibleForPosition(p, position)
      );

      if (playerIndex !== -1) {
        const player = remainingPlayers[playerIndex];
        slots[index] = formatPlayer(player);
        primarySlots.set(player.player.id, position);
        remainingPlayers.splice(playerIndex, 1);
      }
    });

    // Fill G slot (index 5)
    // Try remaining guards first
    let guardSlotPlayer = remainingPlayers.find(p => 
      !flexUsedPlayerIds.has(p.player.id) && isEligibleForPosition(p, 'G')
    );
    
    // If no remaining guards, look for a guard in a primary position not used in flex
    if (!guardSlotPlayer) {
      const primaryGuards = Array.from(primarySlots.entries())
        .filter(([id, pos]) => 
          (pos === 'PG' || pos === 'SG') && !flexUsedPlayerIds.has(id)
        )
        .map(([id]) => players.find(p => p.player.id === id))
        .filter(p => p);
        
      if (primaryGuards.length > 0) {
        guardSlotPlayer = primaryGuards[0];
      }
    }
    
    if (guardSlotPlayer) {
      slots[5] = formatPlayer(guardSlotPlayer);
      markPlayerAsUsedInFlex(guardSlotPlayer);
      remainingPlayers = remainingPlayers.filter(p => p.player.id !== guardSlotPlayer.player.id);
    }

    // Fill F slot (index 6)
    // Try remaining forwards first
    let forwardSlotPlayer = remainingPlayers.find(p => 
      !flexUsedPlayerIds.has(p.player.id) && isEligibleForPosition(p, 'F')
    );
    
    // If no remaining forwards, look for a forward in a primary position not used in flex
    if (!forwardSlotPlayer) {
      const primaryForwards = Array.from(primarySlots.entries())
        .filter(([id, pos]) => 
          (pos === 'SF' || pos === 'PF') && !flexUsedPlayerIds.has(id)
        )
        .map(([id]) => players.find(p => p.player.id === id))
        .filter(p => p);
        
      if (primaryForwards.length > 0) {
        forwardSlotPlayer = primaryForwards[0];
      }
    }
    
    if (forwardSlotPlayer) {
      slots[6] = formatPlayer(forwardSlotPlayer);
      markPlayerAsUsedInFlex(forwardSlotPlayer);
      remainingPlayers = remainingPlayers.filter(p => p.player.id !== forwardSlotPlayer.player.id);
    }

    // Fill UTIL slot with first remaining player not used in flex
    const utilPlayer = remainingPlayers.find(p => !flexUsedPlayerIds.has(p.player.id));
    if (utilPlayer) {
      slots[7] = formatPlayer(utilPlayer);
      markPlayerAsUsedInFlex(utilPlayer);
    }

    console.log('Final lineup slots:', slots);
    console.log('Primary slot assignments:', [...primarySlots.entries()]);
    console.log('Flex used player IDs:', [...flexUsedPlayerIds]);
    console.log('Remaining unassigned players:', remainingPlayers);
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