const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

export const exportLineupsToDraftKings = (lineups: any[]) => {
  // Create header row
  const header = NBA_POSITIONS.join('\t');
  
  // Transform lineups into DraftKings format
  const formattedLineups = lineups.map(lineup => {
    const players = lineup.lineup_players || [];
    const sortedPlayers = assignPlayersToSlots(players.map((lp: any) => lp.player));
    
    return sortedPlayers.map(player => 
      `${player.name} (${player.partner_id})`
    ).join('\t');
  });

  // Combine header and lineups
  const content = [header, ...formattedLineups].join('\n');
  
  // Create and trigger download
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `draftkings_nba_lineups_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const assignPlayersToSlots = (players: any[]) => {
  const slots = new Array(8).fill(null);
  const usedPlayers = new Set();

  // Helper function to check if a player can play in a position
  const canPlayPosition = (player: any, pos: string) => {
    const positions = player.roster_positions?.split(',') || [];
    return positions.includes(pos);
  };

  // First, fill the primary positions (PG, SG, SF, PF, C)
  players.forEach(player => {
    if (usedPlayers.has(player.id)) return;
    
    const primaryPos = player.position;
    const slotIndex = NBA_POSITIONS.indexOf(primaryPos);
    
    if (slotIndex !== -1 && slots[slotIndex] === null && canPlayPosition(player, primaryPos)) {
      slots[slotIndex] = player;
      usedPlayers.add(player.id);
    }
  });

  // Fill G slot (can be PG or SG)
  if (slots[5] === null) {
    const guard = players.find(p => 
      !usedPlayers.has(p.id) && 
      (canPlayPosition(p, 'PG') || canPlayPosition(p, 'SG'))
    );
    if (guard) {
      slots[5] = guard;
      usedPlayers.add(guard.id);
    }
  }

  // Fill F slot (can be SF or PF)
  if (slots[6] === null) {
    const forward = players.find(p => 
      !usedPlayers.has(p.id) && 
      (canPlayPosition(p, 'SF') || canPlayPosition(p, 'PF'))
    );
    if (forward) {
      slots[6] = forward;
      usedPlayers.add(forward.id);
    }
  }

  // Fill UTIL slot with remaining player
  if (slots[7] === null) {
    const util = players.find(p => !usedPlayers.has(p.id));
    if (util) {
      slots[7] = util;
      usedPlayers.add(util.id);
    }
  }

  return slots;
};