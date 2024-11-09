import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { AlertCircle, BarChart as BarChartIcon } from 'lucide-react';

interface LineupVisualizationsProps {
  lineup: any;
}

const LineupVisualizations: React.FC<LineupVisualizationsProps> = ({ lineup }) => {
  const playerData = lineup.lineup_players.map((lp: any) => ({
    name: lp.player.name,
    salary: lp.player.salary,
    projectedPoints: parseFloat(lp.player.projected_points.toFixed(2)),
    ownership: parseFloat(lp.player.ownership.toFixed(2)),
    minutes: lp.player.minutes || 0,
  }));

  // Check if we have minutes data for correlation visualization
  const hasMinutesData = playerData.some(player => player.minutes > 0);

  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChartIcon className="h-5 w-5 text-green-600" />
          Player Metrics
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={playerData}>
            <XAxis dataKey="name" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(17 24 39)', 
                border: '1px solid rgb(75 85 99)',
                color: 'white' 
              }} 
            />
            <Bar dataKey="projectedPoints" fill="#10B981" name="Projected Points" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {hasMinutesData ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Minutes vs. Projected Points Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <XAxis 
                dataKey="minutes" 
                name="Minutes" 
                stroke="currentColor"
                label={{ value: 'Minutes', position: 'bottom', fill: 'currentColor' }} 
              />
              <YAxis 
                dataKey="projectedPoints" 
                name="Projected Points" 
                stroke="currentColor"
                label={{ value: 'Projected Points', angle: -90, position: 'left', fill: 'currentColor' }} 
              />
              <ZAxis range={[50, 400]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: 'rgb(17 24 39)', 
                  border: '1px solid rgb(75 85 99)',
                  color: 'white' 
                }} 
              />
              <Scatter data={playerData} fill="#10B981">
                {playerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#10B981" />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <AlertCircle className="h-5 w-5" />
          <p>Minutes data not available for correlation analysis</p>
        </div>
      )}
    </div>
  );
};

export default LineupVisualizations;