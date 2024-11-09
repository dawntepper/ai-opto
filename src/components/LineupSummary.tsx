import { Card, CardContent } from "./ui/card";

interface LineupSummaryProps {
  totalSalary: number;
  totalOwnership: number;
  projectedPoints: number;
}

const LineupSummary = ({ totalSalary, totalOwnership, projectedPoints }: LineupSummaryProps) => (
  <div className="grid grid-cols-3 gap-4 text-center">
    <div>
      <div className="text-sm text-muted-foreground">Salary</div>
      <div className="font-semibold">${totalSalary.toLocaleString()}</div>
    </div>
    <div>
      <div className="text-sm text-muted-foreground">pOwn</div>
      <div className="font-semibold">{totalOwnership.toFixed(2)}%</div>
    </div>
    <div>
      <div className="text-sm text-muted-foreground">fpts</div>
      <div className="font-semibold">{projectedPoints.toFixed(2)}</div>
    </div>
  </div>
);

export default LineupSummary;