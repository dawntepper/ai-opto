const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  const header = NBA_POSITIONS.join('\t');
  
  const formattedLineups = lineups.map((lineup) => {
    const players = lineup.lineup_players || [];
    const slots = new Array(8).fill('()');
    let remainingPlayers = [...players];
    let assignedPlayerIds = new Set();

    const isEligibleForPosition = (player: any, pos: string) => {
      if (!player?.player?.position) return false;
      const positions = player.player.position.split('/');
      
      switch (pos) {
        case 'G':
          const isGuard = positions.some(p => p === 'PG' || p === 'SG');
          console.log(`Checking ${player.player.name} for G slot - positions: ${positions.join('/')} - eligible: ${isGuard}`);
          return isGuard;
        case 'F':
          const isForward = positions.some(p => p === 'SF' || p === 'PF');
          console.log(`Checking ${player.player.name} for F slot - positions: ${positions.join('/')} - eligible: ${isForward}`);
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
        console.log(`Added ${player.player.name} to ${position} slot`);
      }
    });

    // Fill G slot
    const guardIndex = remainingPlayers.findIndex(lp => {
      if (assignedPlayerIds.has(lp.player.id)) {
        console.log(`${lp.player.name} already assigned, skipping for G slot`);
        return false;
      }
      const isEligible = isEligibleForPosition(lp, 'G');
      return isEligible;
    });

    if (guardIndex !== -1) {
      const player = remainingPlayers[guardIndex];
      slots[5] = `${player.player.name} (${player.player.partner_id || ''})`;
      assignedPlayerIds.add(player.player.id);
      console.log(`Added ${player.player.name} to G slot`);
    } else {
      console.log('No eligible player found for G slot. Available players:', 
        remainingPlayers
          .filter(p => !assignedPlayerIds.has(p.player.id))
          .map(p => `${p.player.name} (${p.player.position})`)
      );
    }

    // Fill F slot
    const forwardIndex = remainingPlayers.findIndex(lp => {
      if (assignedPlayerIds.has(lp.player.id)) {
        console.log(`${lp.player.name} already assigned, skipping for F slot`);
        return false;
      }
      const isEligible = isEligibleForPosition(lp, 'F');
      return isEligible;
    });

    if (forwardIndex !== -1) {
      const player = remainingPlayers[forwardIndex];
      slots[6] = `${player.player.name} (${player.player.partner_id || ''})`;
      assignedPlayerIds.add(player.player.id);
      console.log(`Added ${player.player.name} to F slot`);
    } else {
      console.log('No eligible player found for F slot. Available players:', 
        remainingPlayers
          .filter(p => !assignedPlayerIds.has(p.player.id))
          .map(p => `${p.player.name} (${p.player.position})`)
      );
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