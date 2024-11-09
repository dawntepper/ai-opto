import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { OptimizationSettings as Settings } from '../types';

interface OptimizationSettingsProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const OptimizationSettings = ({ settings, setSettings }: OptimizationSettingsProps) => {
  return (
    <TooltipProvider>
      <Card className="p-4 bg-white/5">
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
              <TooltipContent className="max-w-[200px] whitespace-normal">
                <p>The maximum total salary allowed for a lineup (DraftKings limit: 50000)</p>
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
                  <label className="block text-sm">Minimum Value</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px] whitespace-normal">
                <p>The minimum fantasy points per $1000 salary required for a player (typical range: 3-6)</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type="number"
              value={settings.minValue}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setSettings({ ...settings, minValue: Math.min(Math.max(value, 0), 10) });
                }
              }}
              min={0}
              max={10}
              step={0.1}
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
              <TooltipContent className="max-w-[200px] whitespace-normal">
                <p>The maximum projected ownership percentage allowed for any player (0-100%)</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type="number"
              value={settings.maxOwnership}
              onChange={(e) => {
                const ownership = parseFloat(e.target.value);
                if (!isNaN(ownership)) {
                  setSettings({ ...settings, maxOwnership: Math.min(Math.max(ownership, 0), 100) });
                }
              }}
              min={0}
              max={100}
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
              <TooltipContent className="max-w-[200px] whitespace-normal">
                <p>How strongly correlated players should be stacked in lineups</p>
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