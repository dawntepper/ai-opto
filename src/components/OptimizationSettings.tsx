import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OptimizationSettings as Settings } from '../types';

interface OptimizationSettingsProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const OptimizationSettings = ({ settings, setSettings }: OptimizationSettingsProps) => {
  return (
    <Card className="p-4 bg-white/5">
      <h3 className="text-xl font-semibold mb-4">Optimization Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Maximum Salary</label>
          <Input
            type="number"
            value={settings.maxSalary}
            onChange={(e) => {
              const salary = parseInt(e.target.value);
              if (!isNaN(salary)) {
                setSettings({ ...settings, maxSalary: salary });
              }
            }}
            min={1}
            className="bg-white/5"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Minimum Value</label>
          <Input
            type="number"
            value={settings.minValue}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setSettings({ ...settings, minValue: value });
              }
            }}
            min={0}
            step={0.1}
            className="bg-white/5"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Maximum Ownership</label>
          <Input
            type="number"
            value={settings.maxOwnership}
            onChange={(e) => {
              const ownership = parseFloat(e.target.value);
              if (!isNaN(ownership)) {
                setSettings({ ...settings, maxOwnership: ownership });
              }
            }}
            min={0}
            max={100}
            className="bg-white/5"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Correlation Strength</label>
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
  );
};

export default OptimizationSettings;