import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Settings2 } from "lucide-react";
import { EntryType, OptimizationSettings } from '../types';
import { getDefaultMaxOwnership, getDefaultCorrelation, getDefaultLineupCount, getMaxLineups } from '../utils/optimizationDefaults';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EntryTypeSettingsProps {
  settings: OptimizationSettings;
  setSettings: (settings: OptimizationSettings) => void;
}

const EntryTypeSettings = ({ settings, setSettings }: EntryTypeSettingsProps) => {
  return (
    <Card className="p-4 bg-gray-200 dark:bg-gray-800 border-green-100">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="h-5 w-5 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Entry Type Settings</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sport
          </label>
          <Select
            value={settings.sport || 'nba'}
            onValueChange={(sport: 'nba' | 'nfl') => 
              setSettings({ ...settings, sport })
            }
          >
            <SelectTrigger className="bg-white dark:bg-gray-700 border-green-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nba">NBA</SelectItem>
              <SelectItem value="nfl">NFL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={settings.entryType === 'single' ? "default" : "outline"}
            onClick={() => setSettings({ 
              ...settings, 
              entryType: 'single',
              maxOwnership: getDefaultMaxOwnership('single', settings.sport),
              correlationStrength: getDefaultCorrelation('single', settings.sport),
              lineupCount: getDefaultLineupCount('single')
            })}
            className={`${settings.entryType !== 'single' ? "text-gray-700 dark:text-gray-300 border-green-100" : "bg-green-600 hover:bg-green-700 text-white"}`}
          >
            Single
          </Button>
          <Button
            variant={settings.entryType === '3-max' ? "default" : "outline"}
            onClick={() => setSettings({ 
              ...settings, 
              entryType: '3-max',
              maxOwnership: getDefaultMaxOwnership('3-max', settings.sport),
              correlationStrength: getDefaultCorrelation('3-max', settings.sport),
              lineupCount: getDefaultLineupCount('3-max')
            })}
            className={`${settings.entryType !== '3-max' ? "text-gray-700 dark:text-gray-300 border-green-100" : "bg-green-600 hover:bg-green-700 text-white"}`}
          >
            3-Max
          </Button>
          <Button
            variant={settings.entryType === '20-max' ? "default" : "outline"}
            onClick={() => setSettings({ 
              ...settings, 
              entryType: '20-max',
              maxOwnership: getDefaultMaxOwnership('20-max', settings.sport),
              correlationStrength: getDefaultCorrelation('20-max', settings.sport),
              lineupCount: getDefaultLineupCount('20-max')
            })}
            className={`${settings.entryType !== '20-max' ? "text-gray-700 dark:text-gray-300 border-green-100" : "bg-green-600 hover:bg-green-700 text-white"}`}
          >
            20-Max
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Lineups
          </label>
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
            className="bg-white dark:bg-gray-700 border-green-100 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </Card>
  );
};

export default EntryTypeSettings;