import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { AlertCircle, BarChart as BarChartIcon, TrendingUp, Activity } from 'lucide-react';
import { Card } from './ui/card';

interface LineupVisualizationsProps {
  lineup: any;
}

const LineupVisualizations: React.FC<LineupVisualizationsProps> = ({ lineup }) => {
  const playerData = lineup.lineup_players.map((lp: any) => ({
    name: lp.player.name,
    salary: lp.player.salary,
    projectedPoints: parseFloat(lp.player.projected_points.toFixed(2)),
    ownership: parseFloat(lp.player.ownership?.toFixed(2) || '0'),
    minutes: lp.player.minutes || 0,
    usage: lp.player.usage_rate || 0,
    dvp: lp.player.dvp || 0,
    fppm: lp.player.fppm || 0,
  }));

  const radarData = playerData.map(player => ({
    name: player.name,
    'Proj Pts': (player.projectedPoints / Math.max(...playerData.map(p => p.projectedPoints))) * 100,
    'Usage': player.usage,
    'FPPM': (player.fppm / Math.max(...playerData.map(p => p.fppm))) * 100,
    'Minutes': (player.minutes / Math.max(...playerData.map(p => p.minutes))) * 100,
    'DVP': player.dvp,
  }));

  // Check if we have enhanced metrics data
  const hasEnhancedMetrics = playerData.some(player => player.usage > 0 || player.dvp > 0);

  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChartIcon className="h-5 w-5 text-green-600" />
          Projected Points Distribution
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
      </Card>

      {hasEnhancedMetrics && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Player Metrics Comparison
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="currentColor" />
              <PolarAngleAxis dataKey="name" stroke="currentColor" />
              <PolarRadiusAxis stroke="currentColor" />
              <Radar
                name="Projected Points %"
                dataKey="Proj Pts"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.5}
              />
              <Radar
                name="Usage %"
                dataKey="Usage"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.5}
              />
              <Radar
                name="FPPM %"
                dataKey="FPPM"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.5}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Minutes vs. Projected Points
        </h3>
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
      </Card>

      {!hasEnhancedMetrics && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <AlertCircle className="h-5 w-5" />
          <p>Enhanced metrics (Usage Rate, DVP, FPPM) not available for visualization</p>
        </div>
      )}
    </div>
  );
};

export default LineupVisualizations;