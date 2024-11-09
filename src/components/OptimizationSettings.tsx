import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { OptimizationSettings as Settings } from '../types';
import { useEffect } from 'react';

interface OptimizationSettingsProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const getSalaryTooltip = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return "Using 98-100% of salary cap ($49,000-$50,000) recommended to maximize ceiling potential. Avoid leaving more than $1,000 on the table as single-entry lineups need every point for tournaments.";
    case '3-max':
      return "Strategic salary variation recommended:\n- Lineup 1: $49,500-$50,000 (balanced build)\n- Lineup 2: $48,500-$49,500 (mid-range focus)\n- Lineup 3: $47,500-$48,500 (value-focused build)\n\nThis creates natural differentiation while maintaining upside.";
    case '20-max':
      return "Implement strategic salary distribution:\n- 15% of lineups: $49,700-$50,000 (maximum ceiling)\n- 40% of lineups: $48,500-$49,700 (balanced builds)\n- 30% of lineups: $47,500-$48,500 (value leverage)\n- 15% of lineups: $46,500-$47,500 (extreme differentiation)";
  }
};

const getCorrelationTooltip = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return "Target moderate correlation:\n- Maximum 2 players from same team\n- One mini-stack (2 players) plus game bring-back\n- Avoid over-stacking in single entry";
    case '3-max':
      return "Implement distinct correlation strategies per lineup:\n- Lineup 1: 2-1 mini-stack with game bring-back\n- Lineup 2: 3-2 game stack\n- Lineup 3: 3-1 team stack with differentiated bring-back";
    case '20-max':
      return "Systematic correlation implementation:\n- Max 25% exposure to any single game stack\n- Max 30% exposure to any team stack\n- Include 20% negative correlation lineups\n- Vary stack types across lineup sets\n\nCorrelation Rules:\n- 30% of lineups: 4-2 or 3-3 game stacks\n- 40% of lineups: 3-1 team stacks with bring-back\n- 30% of lineups: 2-1 mini-stacks with varied correlation";
  }
};

const getMaxOwnershipLimit = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return 30;
    case '3-max':
      return 35;
    case '20-max':
      return 25;
  }
};

const getOwnershipTooltip = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return "Maximum 30% ownership per player\n- Allows for 1-2 popular plays\n- Maintains differentiation potential\n- Reduces risk from chalk busts";
    case '3-max':
      return "Decreasing ownership caps across lineups:\n- Lineup 1: 35% max ownership\n- Lineup 2: 25% max ownership\n- Lineup 3: 20% max ownership\n\nOverall portfolio max: 35%";
    case '20-max':
      return "Structured ownership caps:\n- No player over 25% exposure\n- Maximum 35% to any game environment\n- Chalk players (>25% projected) capped at 20% exposure\n- At least 30% of lineups using sub-10% owned players\n\nOverall portfolio max: 25%";
  }
};

const OptimizationSettings = ({ settings, setSettings }: OptimizationSettingsProps) => {
  useEffect(() => {
    const maxLimit = getMaxOwnershipLimit(settings.entryType);
    if (settings.maxOwnership > maxLimit) {
      setSettings({ ...settings, maxOwnership: maxLimit });
    }
  }, [settings.entryType]);

  return (
    <TooltipProvider>
      <Card className="p-4 bg-green-50/5 dark:bg-green-900/10 border-green-100/20">
        <h3 className="text-xl font-semibold mb-4">Optimization Settings</h3>
        <div className="space-y-4">
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help mb-2">
                  <label className="block text-sm font-medium">Salary Cap Usage</label>
                  <Info className="h-4 w-4 text-green-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[300px] p-4 bg-green-950/90 text-green-50">
                <p className="whitespace-pre-line">{getSalaryTooltip(settings.entryType)}</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type="number"
              value={settings.maxSalary}
              onChange={(e) => {
                const salary = parseInt(e.target.value);
                if (!isNaN(salary)) {
                  setSettings({ ...settings, maxSalary: Math.min(Math.max(salary, 30000), 50000) });
                }
              }}
              min={30000}
              max={50000}
              className="bg-green-950/20 border-green-100/20"
            />
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help mb-2">
                  <label className="block text-sm font-medium">Maximum Ownership</label>
                  <Info className="h-4 w-4 text-green-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[300px] p-4 bg-green-950/90 text-green-50">
                <p className="whitespace-pre-line">{getOwnershipTooltip(settings.entryType)}</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type="number"
              value={settings.maxOwnership}
              onChange={(e) => {
                const ownership = parseFloat(e.target.value);
                if (!isNaN(ownership)) {
                  const maxLimit = getMaxOwnershipLimit(settings.entryType);
                  setSettings({ ...settings, maxOwnership: Math.min(Math.max(ownership, 0), maxLimit) });
                }
              }}
              min={0}
              max={getMaxOwnershipLimit(settings.entryType)}
              step={1}
              className="bg-green-950/20 border-green-100/20"
            />
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help mb-2">
                  <label className="block text-sm font-medium">Correlation Strategy</label>
                  <Info className="h-4 w-4 text-green-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[300px] p-4 bg-green-950/90 text-green-50">
                <p className="whitespace-pre-line">{getCorrelationTooltip(settings.entryType)}</p>
              </TooltipContent>
            </Tooltip>
            <Select
              value={settings.correlationStrength}
              onValueChange={(value: 'weak' | 'medium' | 'strong') => 
                setSettings({ ...settings, correlationStrength: value })
              }
            >
              <SelectTrigger className="bg-green-950/20 border-green-100/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weak">Weak</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="strong">Strong</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default OptimizationSettings;
