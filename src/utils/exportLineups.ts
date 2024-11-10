const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    const usedPlayerIds = new Set();
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
      usedPlayerIds.add(player.player.id);
      return `${player.player.name} (${player.player.partner_id || ''})`;
    };

    // Helper function to find an unused player for a position
    const findUnusedPlayerForPosition = (position: string) => {
      return players.find(p => 
        !usedPlayerIds.has(p.player.id) && 
        isEligibleForPosition(p, position)
      );
    };

    // Fill primary positions first (PG, SG, SF, PF, C)
    ['PG', 'SG', 'SF', 'PF', 'C'].forEach((pos, index) => {
      const player = findUnusedPlayerForPosition(pos);
      if (player) {
        slots[index] = formatPlayer(player);
        positionAssignments.set(player.player.id, pos);
      }
    });

    // For G slot, find any unused guard
    const gSlotPlayer = findUnusedPlayerForPosition('G');
    if (gSlotPlayer) {
      slots[5] = formatPlayer(gSlotPlayer);
      positionAssignments.set(gSlotPlayer.player.id, 'G');
    }

    // For F slot, find any unused forward
    const fSlotPlayer = findUnusedPlayerForPosition('F');
    if (fSlotPlayer) {
      slots[6] = formatPlayer(fSlotPlayer);
      positionAssignments.set(fSlotPlayer.player.id, 'F');
    }

    // For UTIL, use any remaining unused player
    const remainingPlayer = players.find(p => !usedPlayerIds.has(p.player.id));
    if (remainingPlayer) {
      slots[7] = formatPlayer(remainingPlayer);
      positionAssignments.set(remainingPlayer.player.id, 'UTIL');
    }

    console.log('Final lineup slots:', slots);
    console.log('Position assignments:', Object.fromEntries(positionAssignments));
    console.log('Used player IDs:', [...usedPlayerIds]);
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