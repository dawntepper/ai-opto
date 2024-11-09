import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { EntryType, OptimizationSettings } from '../types';

interface LineupOptimizerProps {
  entryType: EntryType;
}

const LineupOptimizer = ({ entryType }: LineupOptimizerProps) => {
  const [settings, setSettings] = useState<OptimizationSettings>({
    entryType,
    maxSalary: 50000,
    minValue: 4,
    maxOwnership: 100,
    correlationStrength: 'medium'
  });

  const handleOptimize = () => {
    // TODO: Implement optimization logic
    console.log('Optimizing with settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-white/5">
          <h3 className="text-xl font-semibold mb-4">Optimization Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Max Salary Cap</label>
              <Slider
                value={[settings.maxSalary]}
                min={40000}
                max={50000}
                step={100}
                onValueChange={(value) => setSettings({ ...settings, maxSalary: value[0] })}
              />
              <span className="text-sm text-gray-300">${settings.maxSalary.toLocaleString()}</span>
            </div>

            <div>
              <label className="block text-sm mb-2">Max Ownership %</label>
              <Slider
                value={[settings.maxOwnership]}
                min={0}
                max={100}
                onValueChange={(value) => setSettings({ ...settings, maxOwnership: value[0] })}
              />
              <span className="text-sm text-gray-300">{settings.maxOwnership}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/5">
          <h3 className="text-xl font-semibold mb-4">Entry Type Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={settings.entryType === 'single' ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, entryType: 'single' })}
                className={settings.entryType !== 'single' ? "text-primary" : ""}
              >
                Single
              </Button>
              <Button
                variant={settings.entryType === '3-max' ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, entryType: '3-max' })}
                className={settings.entryType !== '3-max' ? "text-primary" : ""}
              >
                3-Max
              </Button>
              <Button
                variant={settings.entryType === '20-max' ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, entryType: '20-max' })}
                className={settings.entryType !== '20-max' ? "text-primary" : ""}
              >
                20-Max
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleOptimize}
          className="bg-secondary hover:bg-secondary/90"
        >
          Generate Optimal Lineups
        </Button>
      </div>
    </div>
  );
};

export default LineupOptimizer;