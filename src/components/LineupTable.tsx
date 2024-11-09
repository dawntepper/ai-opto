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
          <TableRow className="bg-muted">
            <TableHead className="text-foreground">Slot</TableHead>
            <TableHead className="text-foreground">Player</TableHead>
            <TableHead className="text-foreground">Match</TableHead>
            <TableHead className="text-right text-foreground">Salary</TableHead>
            <TableHead className="text-right text-foreground">pOwn</TableHead>
            <TableHead className="text-right text-foreground">Fpts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players && players.map((lp, index) => (
            <TableRow key={`${lp.player.id}`} className="hover:bg-muted">
              <TableCell className="font-medium text-foreground">
                {NBA_POSITIONS[index]}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">{lp.player.team}</span>
                  <span className="font-medium text-foreground">{lp.player.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-foreground">{lp.player.team} @ {lp.player.opponent}</TableCell>
              <TableCell className="text-right text-foreground">${lp.player.salary.toLocaleString()}</TableCell>
              <TableCell className="text-right text-foreground">{lp.player.ownership.toFixed(2)}%</TableCell>
              <TableCell className="text-right text-foreground">{lp.player.projected_points.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted font-medium">
            <TableCell colSpan={3} className="text-foreground">Total</TableCell>
            <TableCell className="text-right text-foreground">${totalSalary.toLocaleString()}</TableCell>
            <TableCell className="text-right text-foreground">{totalOwnership.toFixed(2)}%</TableCell>
            <TableCell className="text-right text-foreground">{projectedPoints.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default LineupTable;