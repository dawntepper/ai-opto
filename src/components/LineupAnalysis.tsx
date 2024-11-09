import React from 'react';

interface LineupAnalysisProps {
  lineup: any; // Replace 'any' with a more specific type if available
}

const LineupAnalysis: React.FC<LineupAnalysisProps> = ({ lineup }) => {
  // Calculate some analysis metrics
  const averageSalary = lineup.total_salary / lineup.lineup_players.length;
  const highCeilingPlayers = lineup.lineup_players.filter((lp: any) => lp.player.ceiling > lp.player.projected_points * 1.2);
  const lowOwnershipPlayers = lineup.lineup_players.filter((lp: any) => lp.player.ownership < 10);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Lineup Analysis</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Total Salary: ${lineup.total_salary.toLocaleString()} (Avg: ${averageSalary.toFixed(0)})</li>
        <li>Projected Points: {lineup.projected_points.toFixed(2)}</li>
        <li>Total Ownership: {lineup.total_ownership.toFixed(2)}%</li>
        <li>High Ceiling Players: {highCeilingPlayers.length}</li>
        <li>Low Ownership Players: {lowOwnershipPlayers.length}</li>
      </ul>
      <div className="mt-4">
        <h4 className="font-semibold">Key Insights:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>This lineup leverages {highCeilingPlayers.length} high-ceiling players for tournament upside.</li>
          <li>It includes {lowOwnershipPlayers.length} low-ownership players for differentiation.</li>
          <li>The average salary utilization is efficient at ${averageSalary.toFixed(0)} per player.</li>
        </ul>
      </div>
    </div>
  );
};

export default LineupAnalysis;