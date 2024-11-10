const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    let remainingPlayers = [...players];
    const usedPlayerIds = new Set();

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
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const playerIndex = remainingPlayers.findIndex(p => 
        !usedPlayerIds.has(p.player.id) && isEligibleForPosition(p, position)
      );

      if (playerIndex !== -1) {
        const player = remainingPlayers[playerIndex];
        slots[index] = formatPlayer(player);
        usedPlayerIds.add(player.player.id);
        remainingPlayers.splice(playerIndex, 1);
      }
    });

    // Fill G slot (index 5)
    // First try remaining guards, then find an unused eligible guard
    const unusedGuard = players.find(p => 
      !usedPlayerIds.has(p.player.id) && isEligibleForPosition(p, 'G')
    );
    
    if (unusedGuard) {
      slots[5] = formatPlayer(unusedGuard);
      usedPlayerIds.add(unusedGuard.player.id);
      remainingPlayers = remainingPlayers.filter(p => p.player.id !== unusedGuard.player.id);
    }

    // Fill F slot (index 6)
    // First try remaining forwards, then find an unused eligible forward
    const unusedForward = players.find(p => 
      !usedPlayerIds.has(p.player.id) && isEligibleForPosition(p, 'F')
    );
    
    if (unusedForward) {
      slots[6] = formatPlayer(unusedForward);
      usedPlayerIds.add(unusedForward.player.id);
      remainingPlayers = remainingPlayers.filter(p => p.player.id !== unusedForward.player.id);
    }

    // Fill UTIL slot with first remaining unused player
    const unusedUtil = players.find(p => !usedPlayerIds.has(p.player.id));
    if (unusedUtil) {
      slots[7] = formatPlayer(unusedUtil);
      usedPlayerIds.add(unusedUtil.player.id);
    }

    console.log('Final lineup slots:', slots);
    console.log('Used player IDs:', [...usedPlayerIds]);
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