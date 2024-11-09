import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LineupVisualizationsProps {
  lineup: any; // Replace 'any' with a more specific type if available
}

const LineupVisualizations: React.FC<LineupVisualizationsProps> = ({ lineup }) => {
  const playerData = lineup.lineup_players.map((lp: any) => ({
    name: lp.player.name,
    salary: lp.player.salary,
    projectedPoints: parseFloat(lp.player.projected_points.toFixed(2)),
    ownership: parseFloat(lp.player.ownership.toFixed(2)),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Player Salaries</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={playerData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="salary" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Projected Points</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={playerData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="projectedPoints" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Player Ownership</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={playerData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ownership" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineupVisualizations;