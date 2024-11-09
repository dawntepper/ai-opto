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

const getMaxOwnershipLimit = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return 35; // More conservative for single entry
    case '3-max':
      return 45; // Moderate for 3-max
    case '20-max':
      return 55; // More aggressive for 20-max
    default:
      return 35;
  }
};

const getOwnershipTooltip = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return "Lower ownership cap (35%) for single-entry to reduce risk and avoid popular chalk plays. This helps differentiate your lineup in large tournaments.";
    case '3-max':
      return "Moderate ownership cap (45%) for 3-max entries balances risk and reward. You can take some chances on popular plays while maintaining uniqueness.";
    case '20-max':
      return "Higher ownership cap (55%) for 20-max entries allows exposure to chalk plays. With multiple entries, you can afford to have some lineups with popular combinations.";
  }
};

const getCorrelationTooltip = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return "For single entry, medium correlation is recommended to balance upside potential with risk management.";
    case '3-max':
      return "For 3-max, you can mix correlation strengths across your entries to create lineup diversity.";
    case '20-max':
      return "For 20-max, strong correlation is often preferred as you can create multiple correlated stacks across your lineup set.";
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
      <Card className="p-4 bg-green-50 dark:bg-green-900/10">
        <h3 className="text-xl font-semibold mb-4">Optimization Settings</h3>
        <div className="space-y-4">
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help mb-2">
                  <label className="block text-sm">Maximum Salary</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] whitespace-normal">
                <p>The maximum total salary allowed for a lineup (DraftKings limit: 50000). Using the full salary cap is recommended for tournaments to maximize potential scoring.</p>
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
              className="bg-white/5"
            />
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help mb-2">
                  <label className="block text-sm">Maximum Ownership</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] whitespace-normal">
                <p>{getOwnershipTooltip(settings.entryType)}</p>
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
              className="bg-white/5"
            />
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help mb-2">
                  <label className="block text-sm">Correlation Strength</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] whitespace-normal">
                <p>{getCorrelationTooltip(settings.entryType)}</p>
              </TooltipContent>
            </Tooltip>
            <Select
              value={settings.correlationStrength}
              onValueChange={(value: 'weak' | 'medium' | 'strong') => 
                setSettings({ ...settings, correlationStrength: value })
              }
            >
              <SelectTrigger className="bg-white/5">
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