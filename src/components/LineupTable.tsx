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
}

interface LineupTableProps {
  players: { player: Player }[];
  totalSalary: number;
  totalOwnership: number;
  projectedPoints: number;
}

const LineupTable = ({ players, totalSalary, totalOwnership, projectedPoints }: LineupTableProps) => (
  <Table className="relative">
    <TableHeader>
      <TableRow>
        <TableHead>Slot</TableHead>
        <TableHead>Player</TableHead>
        <TableHead>Match</TableHead>
        <TableHead className="text-right">Salary</TableHead>
        <TableHead className="text-right">pOwn</TableHead>
        <TableHead className="text-right">Fpts</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody className="relative">
      {players?.map((lp) => (
        <TableRow key={`${lp.player.id}`} className="relative">
          <TableCell>{lp.player.position}</TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="font-medium text-gray-500">{lp.player.team}</div>
              <div className="relative z-10">{lp.player.name}</div>
            </div>
          </TableCell>
          <TableCell>{lp.player.team} @ {lp.player.opponent}</TableCell>
          <TableCell className="text-right">${lp.player.salary.toLocaleString()}</TableCell>
          <TableCell className="text-right">{lp.player.ownership.toFixed(2)}%</TableCell>
          <TableCell className="text-right">{lp.player.projected_points.toFixed(2)}</TableCell>
        </TableRow>
      ))}
      <TableRow className="bg-muted/50 font-medium">
        <TableCell colSpan={3}>Total</TableCell>
        <TableCell className="text-right">${totalSalary.toLocaleString()}</TableCell>
        <TableCell className="text-right">{totalOwnership.toFixed(2)}%</TableCell>
        <TableCell className="text-right">{projectedPoints.toFixed(2)}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export default LineupTable;