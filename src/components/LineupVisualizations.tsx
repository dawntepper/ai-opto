import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid } from 'recharts';
import { Card } from './ui/card';

interface LineupVisualizationsProps {
  lineup: any;
}

const LineupVisualizations = ({ lineup }: LineupVisualizationsProps) => {
  const radarData = useMemo(() => {
    if (!lineup.lineup_players?.length) return [];
    
    return lineup.lineup_players.map((lp: any) => ({
      name: lp.player.name,
      'Usage Rate': lp.player.usage_rate || 0,
      'DVP': lp.player.dvp || 0,
      'FPPM': (lp.player.fppm || 0) * 10, // Scale up for visibility
      'Proj Points': lp.player.projected_points || 0,
      'Minutes': lp.player.minutes || 0,
    }));
  }, [lineup]);

  const scatterData = useMemo(() => {
    if (!lineup.lineup_players?.length) return [];
    
    return lineup.lineup_players.map((lp: any) => ({
      name: lp.player.name,
      minutes: lp.player.minutes || 0,
      projectedPoints: lp.player.projected_points || 0,
      salary: lp.player.salary,
    }));
  }, [lineup]);

  const hasEnhancedMetrics = lineup.lineup_players?.some((lp: any) => 
    lp.player.usage_rate || lp.player.dvp || lp.player.fppm
  );

  if (!hasEnhancedMetrics) {
    return (
      <div className="text-center p-4 text-gray-500">
        Enhanced metrics not available for this lineup
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Player Metrics Comparison</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Tooltip />
              <Radar
                name="Usage Rate"
                dataKey="Usage Rate"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.3}
              />
              <Radar
                name="DVP"
                dataKey="DVP"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Radar
                name="FPPM"
                dataKey="FPPM"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Minutes vs Projected Points</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="minutes" 
                name="Minutes" 
                unit=" min"
              />
              <YAxis 
                type="number" 
                dataKey="projectedPoints" 
                name="Projected Points" 
                unit=" pts"
              />
              <ZAxis 
                type="number" 
                dataKey="salary" 
                range={[50, 400]} 
                name="Salary"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2 rounded shadow border">
                      <p className="font-semibold">{data.name}</p>
                      <p>Minutes: {data.minutes}</p>
                      <p>Projected: {data.projectedPoints.toFixed(1)} pts</p>
                      <p>Salary: ${data.salary.toLocaleString()}</p>
                    </div>
                  );
                }}
              />
              <Scatter 
                data={scatterData} 
                fill="#22c55e"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default LineupVisualizations;