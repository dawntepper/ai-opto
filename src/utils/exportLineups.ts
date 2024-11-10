const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    const usedPlayerIds = new Set();
    const primaryPositionPlayers = new Map(); // Track players in primary positions

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
        !usedPlayerIds.has(p.player.id) && isEligibleForPosition(p, pos)
      );

      if (playerIndex !== -1) {
        const player = players[playerIndex];
        slots[index] = formatPlayer(player);
        usedPlayerIds.add(player.player.id);
        primaryPositionPlayers.set(player.player.id, pos);
      }
    });

    // Get eligible players for G slot
    const eligibleGuards = players.filter(p => isEligibleForPosition(p, 'G'));
    const gSlotPlayer = eligibleGuards.find(p => !usedPlayerIds.has(p.player.id)) || 
                       eligibleGuards[0]; // Use first guard if no unused guards available

    if (gSlotPlayer) {
      slots[5] = formatPlayer(gSlotPlayer);
    }

    // Get eligible players for F slot
    const eligibleForwards = players.filter(p => isEligibleForPosition(p, 'F'));
    const fSlotPlayer = eligibleForwards.find(p => !usedPlayerIds.has(p.player.id)) || 
                       eligibleForwards.find(p => p.player.id !== gSlotPlayer?.player.id); // Avoid using G slot player

    if (fSlotPlayer) {
      slots[6] = formatPlayer(fSlotPlayer);
    }

    // Find remaining unused player for UTIL
    const utilisedIds = new Set([
      ...slots.map(slot => {
        const match = slot.match(/\((\d+)\)/);
        return match ? match[1] : null;
      }).filter(id => id)
    ]);

    const utilPlayer = players.find(p => !utilisedIds.has(p.player.partner_id));
    if (utilPlayer) {
      slots[7] = formatPlayer(utilPlayer);
    }

    console.log('Final lineup slots:', slots);
    console.log('Primary positions:', Object.fromEntries(primaryPositionPlayers));
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