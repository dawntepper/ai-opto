const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Starting export process with lineups:', lineups.length);
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join('\t');
  console.log('Generated header:', header);
  
  const formattedLineups = lineups.map((lineup, lineupIndex) => {
    console.log(`\nProcessing lineup ${lineupIndex + 1}:`);
    const players = lineup.lineup_players || [];
    console.log('Raw lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    let remainingPlayers = [...players];
    let assignedPlayerIds = new Set();

    // Helper function to check if a player is eligible for a position
    const isEligibleForPosition = (player: any, pos: string) => {
      console.log(`Checking eligibility for position ${pos}:`, player?.player?.name);
      if (!player?.player?.position) {
        console.log('No position data found for player');
        return false;
      }
      const positions = player.player.position.split('/');
      console.log('Player positions:', positions);
      
      let isEligible;
      switch (pos) {
        case 'G':
          isEligible = positions.some(p => p === 'PG' || p === 'SG');
          console.log('Guard eligibility:', isEligible);
          return isEligible;
        case 'F':
          isEligible = positions.some(p => p === 'SF' || p === 'PF');
          console.log('Forward eligibility:', isEligible);
          return isEligible;
        case 'UTIL':
          return true;
        default:
          isEligible = positions.includes(pos);
          console.log(`${pos} eligibility:`, isEligible);
          return isEligible;
      }
    };

    // Fill primary positions first (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      console.log(`\nFilling primary position ${position} (index: ${index})`);
      const playerIndex = remainingPlayers.findIndex(lp => {
        const eligible = !assignedPlayerIds.has(lp.player.id) && isEligibleForPosition(lp, position);
        console.log(`Checking player ${lp.player.name} - Eligible: ${eligible}, Already assigned: ${assignedPlayerIds.has(lp.player.id)}`);
        return eligible;
      });

      if (playerIndex !== -1) {
        const player = remainingPlayers[playerIndex];
        console.log(`Assigned ${player.player.name} to ${position}`);
        slots[index] = `${player.player.name} (${player.player.partner_id || ''})`;
        assignedPlayerIds.add(player.player.id);
      }
    });

    // Fill G slot (index 5) with any remaining eligible guard
    console.log('\nFilling G slot');
    const guardIndex = remainingPlayers.findIndex(lp => {
      if (assignedPlayerIds.has(lp.player.id)) return false;
      const positions = lp.player.position.split('/');
      const eligible = positions.some(p => p === 'PG' || p === 'SG');
      console.log(`Checking player ${lp.player.name} for G slot - Positions: ${positions}, Eligible: ${eligible}`);
      return eligible;
    });

    if (guardIndex !== -1) {
      const player = remainingPlayers[guardIndex];
      console.log(`Assigned ${player.player.name} to G slot`);
      slots[5] = `${player.player.name} (${player.player.partner_id || ''})`;
      assignedPlayerIds.add(player.player.id);
    }

    // Fill F slot (index 6) with any remaining eligible forward
    console.log('\nFilling F slot');
    const forwardIndex = remainingPlayers.findIndex(lp => {
      if (assignedPlayerIds.has(lp.player.id)) return false;
      const positions = lp.player.position.split('/');
      const eligible = positions.some(p => p === 'SF' || p === 'PF');
      console.log(`Checking player ${lp.player.name} for F slot - Positions: ${positions}, Eligible: ${eligible}`);
      return eligible;
    });

    if (forwardIndex !== -1) {
      const player = remainingPlayers[forwardIndex];
      console.log(`Assigned ${player.player.name} to F slot`);
      slots[6] = `${player.player.name} (${player.player.partner_id || ''})`;
      assignedPlayerIds.add(player.player.id);
    }

    // Fill UTIL slot with first remaining unassigned player
    console.log('\nFilling UTIL slot');
    const utilIndex = remainingPlayers.findIndex(lp => !assignedPlayerIds.has(lp.player.id));
    if (utilIndex !== -1) {
      const player = remainingPlayers[utilIndex];
      console.log(`Assigned ${player.player.name} to UTIL slot`);
      slots[7] = `${player.player.name} (${player.player.partner_id || ''})`;
      assignedPlayerIds.add(player.player.id);
    }

    console.log('\nFinal lineup slots:', slots);
    console.log('Assigned player IDs:', [...assignedPlayerIds]);
    console.log('Number of assigned players:', assignedPlayerIds.size);
    return slots.join('\t');
  });

  const content = [header, ...formattedLineups].join('\n');
  console.log('\nFinal content to be exported:', content);
  
  // Create and trigger download of CSV file
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filename = `draftkings_nba_lineups_${new Date().toISOString().split('T')[0]}.csv`;
  console.log('Downloading file:', filename);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  console.log('Export complete');
};