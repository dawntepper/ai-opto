import { TableCell, TableRow } from "@/components/ui/table";
import { Player } from '../types';

interface PlayerPoolRowProps {
  player: Player;
}

const PlayerPoolRow = ({ player }: PlayerPoolRowProps) => {
  return (
    <TableRow className="hover:bg-white/5">
      <TableCell>{player.name}</TableCell>
      <TableCell>{player.position}</TableCell>
      <TableCell>${player.salary.toLocaleString()}</TableCell>
      <TableCell>{player.team}</TableCell>
      <TableCell>{player.opponent}</TableCell>
      <TableCell>{player.projectedPoints}</TableCell>
      <TableCell>{player.ownership}%</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-sm ${
          player.status === 'available' ? 'bg-green-500/20' :
          player.status === 'questionable' ? 'bg-yellow-500/20' :
          'bg-red-500/20'
        }`}>
          {player.status}
        </span>
      </TableCell>
      {player.sport === 'nfl' && (
        <>
          <TableCell>{player.snapCount ?? '-'}%</TableCell>
          <TableCell>{player.targetShare ?? '-'}%</TableCell>
          <TableCell>{player.rushShare ?? '-'}%</TableCell>
        </>
      )}
    </TableRow>
  );
};

export default PlayerPoolRow;