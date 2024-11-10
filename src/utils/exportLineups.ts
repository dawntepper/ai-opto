const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    let remainingPlayers = [...players];

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
    const formatPlayer = (player: any) => 
      `${player.player.name} (${player.player.partner_id || ''})`;

    // Track all guard and forward eligible players
    const guardPlayers = players.filter(p => isEligibleForPosition(p, 'G'));
    const forwardPlayers = players.filter(p => isEligibleForPosition(p, 'F'));

    // Fill primary positions first (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const playerIndex = remainingPlayers.findIndex(p => 
        isEligibleForPosition(p, position)
      );

      if (playerIndex !== -1) {
        const player = remainingPlayers[playerIndex];
        slots[index] = formatPlayer(player);
        remainingPlayers.splice(playerIndex, 1);
      }
    });

    // Fill G slot (index 5)
    // First try remaining guards, then consider moving a PG/SG if needed
    let guardSlotFilled = false;
    
    // Try remaining unassigned guards first
    const remainingGuard = remainingPlayers.find(p => isEligibleForPosition(p, 'G'));
    if (remainingGuard) {
      slots[5] = formatPlayer(remainingGuard);
      remainingPlayers = remainingPlayers.filter(p => p !== remainingGuard);
      guardSlotFilled = true;
    }
    
    // If no remaining guards, look at already assigned PG/SG players
    if (!guardSlotFilled && guardPlayers.length > 0) {
      slots[5] = formatPlayer(guardPlayers[0]);
    }

    // Fill F slot (index 6)
    // First try remaining forwards, then consider moving a SF/PF if needed
    let forwardSlotFilled = false;
    
    // Try remaining unassigned forwards first
    const remainingForward = remainingPlayers.find(p => isEligibleForPosition(p, 'F'));
    if (remainingForward) {
      slots[6] = formatPlayer(remainingForward);
      remainingPlayers = remainingPlayers.filter(p => p !== remainingForward);
      forwardSlotFilled = true;
    }
    
    // If no remaining forwards, look at already assigned SF/PF players
    if (!forwardSlotFilled && forwardPlayers.length > 0) {
      slots[6] = formatPlayer(forwardPlayers[0]);
    }

    // Fill UTIL slot with first remaining player
    if (remainingPlayers.length > 0) {
      slots[7] = formatPlayer(remainingPlayers[0]);
    }

    console.log('Final lineup slots:', slots);
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