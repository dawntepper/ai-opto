const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

const mapPositionToRosterPositions = (position: string): string[] => {
  const positions = position.split('/');
  
  const rosterPositions = positions.flatMap(pos => {
    switch (pos.trim()) {
      case 'PG':
        return ['PG', 'G', 'UTIL'];
      case 'SG':
        return ['SG', 'G', 'UTIL'];
      case 'SF':
        return ['SF', 'F', 'UTIL'];
      case 'PF':
        return ['PF', 'F', 'UTIL'];
      case 'C':
        return ['C', 'UTIL'];
      default:
        return ['UTIL'];
    }
  });

  return [...new Set(rosterPositions)];
};

export const exportLineupsToDraftKings = (lineups: any[]) => {
  console.log('Full lineups data:', JSON.stringify(lineups, null, 2));
  
  const header = NBA_POSITIONS.join(',');
  
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    console.log('Processing lineup players:', JSON.stringify(players, null, 2));
    
    const slots = new Array(8).fill('()');
    let remainingPlayers = [...players];

    // Fill primary positions first (PG, SG, SF, PF, C)
    NBA_POSITIONS.slice(0, 5).forEach((position, index) => {
      const playerIndex = remainingPlayers.findIndex(lp => {
        const rosterPositions = mapPositionToRosterPositions(lp.player?.position || '');
        return rosterPositions.includes(position);
      });

      if (playerIndex !== -1) {
        const player = remainingPlayers[playerIndex];
        slots[index] = `${player.player.name} (${player.player.partner_id || ''})`;
        remainingPlayers.splice(playerIndex, 1);
      }
    });

    // Fill G slot with remaining eligible guard (PG or SG)
    const guardIndex = remainingPlayers.findIndex(lp => {
      const pos = lp.player?.position || '';
      return pos.includes('PG') || pos.includes('SG');
    });

    if (guardIndex !== -1) {
      const guardPlayer = remainingPlayers[guardIndex];
      slots[5] = `${guardPlayer.player.name} (${guardPlayer.player.partner_id || ''})`;
      remainingPlayers.splice(guardIndex, 1);
    } else {
      // If no dedicated guard remains, look through already placed players
      const availableGuard = players.find(lp => {
        const pos = lp.player?.position || '';
        return (pos.includes('PG') || pos.includes('SG')) && 
               !slots.includes(`${lp.player.name} (${lp.player.partner_id || ''})`);
      });
      if (availableGuard) {
        slots[5] = `${availableGuard.player.name} (${availableGuard.player.partner_id || ''})`;
      }
    }

    // Fill F slot with remaining eligible forward (SF or PF)
    const forwardIndex = remainingPlayers.findIndex(lp => {
      const pos = lp.player?.position || '';
      return pos.includes('SF') || pos.includes('PF');
    });

    if (forwardIndex !== -1) {
      const forwardPlayer = remainingPlayers[forwardIndex];
      slots[6] = `${forwardPlayer.player.name} (${forwardPlayer.player.partner_id || ''})`;
      remainingPlayers.splice(forwardIndex, 1);
    } else {
      // If no dedicated forward remains, look through already placed players
      const availableForward = players.find(lp => {
        const pos = lp.player?.position || '';
        return (pos.includes('SF') || pos.includes('PF')) && 
               !slots.includes(`${lp.player.name} (${lp.player.partner_id || ''})`);
      });
      if (availableForward) {
        slots[6] = `${availableForward.player.name} (${availableForward.player.partner_id || ''})`;
      }
    }

    // Fill UTIL slot with first remaining player
    if (remainingPlayers.length > 0) {
      const utilPlayer = remainingPlayers[0];
      slots[7] = `${utilPlayer.player.name} (${utilPlayer.player.partner_id || ''})`;
    }

    console.log('Final lineup slots:', slots);
    return slots.join(',');
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