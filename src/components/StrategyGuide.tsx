import { Card } from "@/components/ui/card";
import { EntryType } from '../types';

interface StrategyGuideProps {
  entryType: EntryType;
}

const StrategyGuide = ({ entryType }: StrategyGuideProps) => {
  const strategies = {
    single: {
      title: "Single-Entry Strategy",
      points: [
        "Mix of chalk and contrarian plays",
        "1-2 leverage plays maximum",
        "Target 2-3 correlated players",
        "One game stack maximum",
        "Aim for 1-2 players under 10% ownership"
      ]
    },
    '3-max': {
      title: "3-Max Strategy",
      points: [
        "Each lineup should have 4+ different players",
        "Vary spend-up spots across lineups",
        "Different game stack targets",
        "Maximum 3 players in all lineups",
        "Mix of game environments"
      ]
    },
    '20-max': {
      title: "20-Max Strategy",
      points: [
        "Clear player exposure rules",
        "Systematic game stack approach",
        "Maximum 40% exposure to any player",
        "Strategic over/underweight vs field",
        "Diversified captain/multiplier spots"
      ]
    }
  };

  const currentStrategy = strategies[entryType];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{currentStrategy.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/5">
          <h3 className="text-xl font-semibold mb-4">Key Principles</h3>
          <ul className="space-y-3">
            {currentStrategy.points.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-secondary mr-2">•</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 bg-white/5">
          <h3 className="text-xl font-semibold mb-4">Recommended Settings</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Ownership Structure</h4>
              <div className="bg-white/10 p-3 rounded">
                {entryType === 'single' && "Target 80-120% cumulative ownership"}
                {entryType === '3-max' && "Vary between 60-120% across lineups"}
                {entryType === '20-max' && "Strategic laddering 40-140%"}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Correlation Strength</h4>
              <div className="bg-white/10 p-3 rounded">
                {entryType === 'single' && "Medium correlation (0.4-0.7)"}
                {entryType === '3-max' && "Mix of medium and strong (0.4-0.8)"}
                {entryType === '20-max' && "Full range (0.2-0.9)"}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StrategyGuide;