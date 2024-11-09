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
      return "Using full salary (within $500 of cap) recommended to maximize ceiling potential.";
    case '3-max':
      return "Vary salary usage across lineups (one near max, one $1-2K under, one $2-3K under) to create differentiation.";
    case '20-max':
      return "Strategically vary salary usage:\n- 25% of lineups: Within $500 of cap\n- 50% of lineups: $500-$2000 under cap\n- 25% of lineups: $2000+ under cap";
  }
};

const getCorrelationTooltip = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return "Target moderate correlation (2-3 correlated players max) to maintain balanced exposure.";
    case '3-max':
      return "Each lineup should feature different correlation approaches:\n- One lineup with game stack\n- One lineup with team stack\n- One lineup with mini-correlations";
    case '20-max':
      return "Use systematic correlation rules:\n- Max 30% exposure to any single game stack\n- Max 35% exposure to any team stack\n- Vary correlation strength across lineup sets\n- Include some negative correlation between competing players";
  }
};

const getMaxOwnershipLimit = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return 35;
    case '3-max':
      return 45;
    case '20-max':
      return 55;
  }
};

const getOwnershipTooltip = (entryType: 'single' | '3-max' | '20-max') => {
  switch (entryType) {
    case 'single':
      return "Lower ownership cap (35%) for single-entry reduces risk and avoids chalk plays. Include 1-2 contrarian plays for differentiation.";
    case '3-max':
      return "Moderate ownership cap (45%) for 3-max entries. Decrease chalk exposure across lineups while maintaining some popular plays.";
    case '20-max':
      return "Higher ownership cap (55%) allows for varied exposure:\n- Core plays: 25-35% exposure\n- Mid-tier: 15-25% exposure\n- Low exposure: 5-15%\n- Dart throws: <5%";
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