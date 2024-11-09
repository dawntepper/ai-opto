import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EntryType, OptimizationSettings } from '../types';
import { getDefaultMaxOwnership, getDefaultCorrelation, getDefaultLineupCount, getMaxLineups } from '../utils/optimizationDefaults';

interface EntryTypeSettingsProps {
  settings: OptimizationSettings;
  setSettings: (settings: OptimizationSettings) => void;
}

const EntryTypeSettings = ({ settings, setSettings }: EntryTypeSettingsProps) => {
  return (
    <Card className="p-4 bg-white/5">
      <h3 className="text-xl font-semibold mb-4">Entry Type Settings</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={settings.entryType === 'single' ? "default" : "outline"}
            onClick={() => setSettings({ 
              ...settings, 
              entryType: 'single',
              maxOwnership: getDefaultMaxOwnership('single'),
              correlationStrength: getDefaultCorrelation('single'),
              lineupCount: getDefaultLineupCount('single')
            })}
            className={settings.entryType !== 'single' ? "text-primary" : ""}
          >
            Single
          </Button>
          <Button
            variant={settings.entryType === '3-max' ? "default" : "outline"}
            onClick={() => setSettings({ 
              ...settings, 
              entryType: '3-max',
              maxOwnership: getDefaultMaxOwnership('3-max'),
              correlationStrength: getDefaultCorrelation('3-max'),
              lineupCount: getDefaultLineupCount('3-max')
            })}
            className={settings.entryType !== '3-max' ? "text-primary" : ""}
          >
            3-Max
          </Button>
          <Button
            variant={settings.entryType === '20-max' ? "default" : "outline"}
            onClick={() => setSettings({ 
              ...settings, 
              entryType: '20-max',
              maxOwnership: getDefaultMaxOwnership('20-max'),
              correlationStrength: getDefaultCorrelation('20-max'),
              lineupCount: getDefaultLineupCount('20-max')
            })}
            className={settings.entryType !== '20-max' ? "text-primary" : ""}
          >
            20-Max
          </Button>
        </div>

        <div>
          <label className="block text-sm mb-2">Number of Lineups</label>
          <Input
            type="number"
            value={settings.lineupCount}
            onChange={(e) => {
              const count = parseInt(e.target.value);
              if (!isNaN(count) && count > 0) {
                setSettings({ ...settings, lineupCount: count });
              }
            }}
            min={1}
            max={getMaxLineups(settings.entryType)}
            className="bg-white/5"
          />
        </div>
      </div>
    </Card>
  );
};

export default EntryTypeSettings;