const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
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
      usedPlayerIds.add(player.player.id);
      return `${player.player.name} (${player.player.partner_id || ''})`;
    };

    // Helper function to find next available player for position
    const findPlayerForPosition = (position: string, availablePlayers: any[]) => {
      return availablePlayers.find(p => 
        !usedPlayerIds.has(p.player.id) && isEligibleForPosition(p, position)
      );
    };

    // Get all available players for each position
    const getAvailablePlayers = () => 
      players.filter(p => !usedPlayerIds.has(p.player.id));

    // Fill positions sequentially
    // Primary positions first (PG, SG, SF, PF, C)
    ['PG', 'SG', 'SF', 'PF', 'C'].forEach((pos, index) => {
      const player = findPlayerForPosition(pos, getAvailablePlayers());
      if (player) {
        slots[index] = formatPlayer(player);
      }
    });

    // Fill G slot (index 5)
    const availableForG = getAvailablePlayers();
    const guardPlayer = findPlayerForPosition('G', availableForG);
    if (guardPlayer) {
      slots[5] = formatPlayer(guardPlayer);
    }

    // Fill F slot (index 6)
    const availableForF = getAvailablePlayers();
    const forwardPlayer = findPlayerForPosition('F', availableForF);
    if (forwardPlayer) {
      slots[6] = formatPlayer(forwardPlayer);
    }

    // Fill UTIL slot (index 7)
    const availableForUtil = getAvailablePlayers();
    if (availableForUtil.length > 0) {
      slots[7] = formatPlayer(availableForUtil[0]);
    }

    console.log('Final lineup slots:', slots);
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