const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');  // Using tab delimiter for DraftKings format
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    let remainingPlayers = [...players];
    let assignedPlayerIds = new Set();

    // Helper function to check if a player is eligible for a position
    const isEligibleForPosition = (player: any, pos: string) => {
      if (!player?.player?.position) return false;
      const positions = player.player.position.split('/');
      switch (pos) {
        case 'G': return positions.some(p => p === 'PG' || p === 'SG');
        case 'F': return positions.some(p => p === 'SF' || p === 'PF');
        case 'UTIL': return true;
        default: return positions.includes(pos);
      }
    };

    // Fill primary positions first (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const playerIndex = remainingPlayers.findIndex(lp => 
        !assignedPlayerIds.has(lp.player.id) && isEligibleForPosition(lp, position)
      );

      if (playerIndex !== -1) {
        const player = remainingPlayers[playerIndex];
        slots[index] = `${player.player.name} (${player.player.partner_id || ''})`;
        assignedPlayerIds.add(player.player.id);
      }
    });

    // Fill G slot (index 5)
    const guardIndex = remainingPlayers.findIndex(lp => 
      !assignedPlayerIds.has(lp.player.id) && isEligibleForPosition(lp, 'G')
    );

    if (guardIndex !== -1) {
      const player = remainingPlayers[guardIndex];
      slots[5] = `${player.player.name} (${player.player.partner_id || ''})`;
      assignedPlayerIds.add(player.player.id);
    }

    // Fill F slot (index 6)
    const forwardIndex = remainingPlayers.findIndex(lp => 
      !assignedPlayerIds.has(lp.player.id) && isEligibleForPosition(lp, 'F')
    );

    if (forwardIndex !== -1) {
      const player = remainingPlayers[forwardIndex];
      slots[6] = `${player.player.name} (${player.player.partner_id || ''})`;
      assignedPlayerIds.add(player.player.id);
    }

    // Fill UTIL slot with first remaining unassigned player
    const utilIndex = remainingPlayers.findIndex(lp => !assignedPlayerIds.has(lp.player.id));
    if (utilIndex !== -1) {
      const player = remainingPlayers[utilIndex];
      slots[7] = `${player.player.name} (${player.player.partner_id || ''})`;
    }

    console.log('Final lineup slots:', slots);
    console.log('Assigned player IDs:', [...assignedPlayerIds]);
    return slots.join('\t');  // Using tab delimiter for DraftKings format
  });

  const content = [header, ...formattedLineups].join('\n');
  
  // Create and trigger download of CSV file
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