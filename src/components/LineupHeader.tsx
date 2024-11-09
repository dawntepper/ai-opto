import { Button } from "./ui/button";

interface LineupHeaderProps {
  onBack: () => void;
  onClearAll: () => void;
}

const LineupHeader = ({ onBack, onClearAll }: LineupHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Generated Lineups</h2>
      <div className="flex gap-2">
        <Button onClick={onBack}>Back to Settings</Button>
        <Button variant="destructive" onClick={onClearAll}>
          Clear All Lineups
        </Button>
      </div>
    </div>
  );
};

export default LineupHeader;