const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map((lineup) => {
    const players = lineup.lineup_players || [];
    const slots = new Array(8).fill('()');
    let remainingPlayers = [...players];
    let assignedPlayerIds = new Set();
    let positionAssignments = new Map(); // Track which positions players are assigned to

    const isEligibleForPosition = (player: any, pos: string) => {
      if (!player?.player?.position) return false;
      const positions = player.player.position.split('/');
      
      switch (pos) {
        case 'G':
          const isGuard = positions.some(p => p === 'PG' || p === 'SG');
          return isGuard;
        case 'F':
          const isForward = positions.some(p => p === 'SF' || p === 'PF');
          return isForward;
        case 'UTIL':
          return true;
        default:
          return positions.includes(pos);
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
        positionAssignments.set(player.player.id, position);
        console.log(`Added ${player.player.name} to ${position} slot`);
      }
    });

    // Fill G slot - consider all players, including those assigned to PG/SG
    console.log('\nProcessing G slot...');
    const eligibleGuards = players.filter(lp => {
      const isEligible = isEligibleForPosition(lp, 'G');
      const currentPosition = positionAssignments.get(lp.player.id);
      const canReuse = currentPosition === 'PG' || currentPosition === 'SG';
      if (!isEligible && !canReuse) {
        console.log(`${lp.player.name} not eligible for G slot (positions: ${lp.player.position})`);
      }
      return isEligible && !assignedPlayerIds.has(lp.player.id) || canReuse;
    });

    if (eligibleGuards.length > 0) {
      const guard = eligibleGuards[0];
      slots[5] = `${guard.player.name} (${guard.player.partner_id || ''})`;
      console.log(`Added ${guard.player.name} to G slot`);
    } else {
      console.log('No eligible guards available for G slot');
    }

    // Fill F slot - consider all players, including those assigned to SF/PF
    console.log('\nProcessing F slot...');
    const eligibleForwards = players.filter(lp => {
      const isEligible = isEligibleForPosition(lp, 'F');
      const currentPosition = positionAssignments.get(lp.player.id);
      const canReuse = currentPosition === 'SF' || currentPosition === 'PF';
      if (!isEligible && !canReuse) {
        console.log(`${lp.player.name} not eligible for F slot (positions: ${lp.player.position})`);
      }
      return isEligible && !assignedPlayerIds.has(lp.player.id) || canReuse;
    });

    if (eligibleForwards.length > 0) {
      const forward = eligibleForwards[0];
      slots[6] = `${forward.player.name} (${forward.player.partner_id || ''})`;
      console.log(`Added ${forward.player.name} to F slot`);
    } else {
      console.log('No eligible forwards available for F slot');
    }

    // Fill UTIL slot
    const utilIndex = remainingPlayers.findIndex(lp => !assignedPlayerIds.has(lp.player.id));
    if (utilIndex !== -1) {
      const player = remainingPlayers[utilIndex];
      slots[7] = `${player.player.name} (${player.player.partner_id || ''})`;
      assignedPlayerIds.add(player.player.id);
      console.log(`Added ${player.player.name} to UTIL slot`);
    }

    return slots.join('\t');
  });

  const content = [header, ...formattedLineups].join('\n');
  
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filename = `draftkings_nba_lineups_${new Date().toISOString().split('T')[0]}.csv`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  console.log('Export complete');
};