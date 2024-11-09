import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  opponent: string;
  salary: number;
  ownership: number;
  projected_points: number;
  partner_id?: string;
}

interface LineupTableProps {
  players: { player: Player }[];
  totalSalary: number;
  totalOwnership: number;
  projectedPoints: number;
}

const NBA_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

const LineupTable = ({ players, totalSalary, totalOwnership, projectedPoints }: LineupTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900">
            <TableHead className="text-gray-900 dark:text-gray-100">Slot</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Player</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Match</TableHead>
            <TableHead className="text-right text-gray-900 dark:text-gray-100">Salary</TableHead>
            <TableHead className="text-right text-gray-900 dark:text-gray-100">pOwn</TableHead>
            <TableHead className="text-right text-gray-900 dark:text-gray-100">Fpts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players && players.map((lp, index) => (
            <TableRow key={`${lp.player.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-900">
              <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                {NBA_POSITIONS[index]}
                {lp.player.partner_id && (
                  <span className="text-xs text-gray-500 ml-1">({lp.player.partner_id})</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{lp.player.team}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{lp.player.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{lp.player.team} @ {lp.player.opponent}</TableCell>
              <TableCell className="text-right text-gray-900 dark:text-gray-100">${lp.player.salary.toLocaleString()}</TableCell>
              <TableCell className="text-right text-gray-900 dark:text-gray-100">{lp.player.ownership.toFixed(2)}%</TableCell>
              <TableCell className="text-right text-gray-900 dark:text-gray-100">{lp.player.projected_points.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-gray-50 dark:bg-gray-900 font-medium">
            <TableCell colSpan={3} className="text-gray-900 dark:text-gray-100">Total</TableCell>
            <TableCell className="text-right text-gray-900 dark:text-gray-100">${totalSalary.toLocaleString()}</TableCell>
            <TableCell className="text-right text-gray-900 dark:text-gray-100">{totalOwnership.toFixed(2)}%</TableCell>
            <TableCell className="text-right text-gray-900 dark:text-gray-100">{projectedPoints.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default LineupTable;